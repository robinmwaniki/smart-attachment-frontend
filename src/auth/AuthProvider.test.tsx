import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { AxiosAdapter } from "axios";
import { AuthProvider } from "./AuthProvider";
import { useAuth } from "./useAuth";
import { apiClient, setAccessTokenProvider } from "../lib/api-client";

const { mockKeycloak, mockGetRealmRoles } = vi.hoisted(() => ({
  mockKeycloak: {
    authenticated: false,
    token: "test-access-token",
    tokenParsed: undefined as Record<string, unknown> | undefined,
    updateToken: vi.fn(),
    clearToken: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    onAuthSuccess: undefined as (() => void) | undefined,
    onAuthLogout: undefined as (() => void) | undefined,
    onAuthRefreshSuccess: undefined as (() => void) | undefined,
    onAuthRefreshError: undefined as (() => void) | undefined,
  },
  mockGetRealmRoles: vi.fn((): Array<"STUDENT" | "COMPANY" | "SUPERVISOR" | "ADMIN"> => []),
}));

vi.mock("./keycloak", () => ({
  keycloak: mockKeycloak,
  getRealmRoles: mockGetRealmRoles,
}));

function AuthState() {
  const auth = useAuth();
  return (
    <p>
      {auth.isLoading ? "loading" : "ready"}:
      {auth.isAuthenticated ? "authenticated" : "anonymous"}:
      {auth.username ?? "no-user"}:
      {auth.roles.join(",") || "no-role"}
    </p>
  );
}

function createAdapter(captured: string[]): AxiosAdapter {
  return vi.fn(async (config) => {
    captured.push(String(config.headers.get("Authorization") ?? ""));
    return {
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  });
}

describe("AuthProvider", () => {
  beforeEach(() => {
    mockKeycloak.authenticated = false;
    mockKeycloak.token = "test-access-token";
    mockKeycloak.tokenParsed = undefined;
    mockKeycloak.updateToken.mockReset().mockResolvedValue(true);
    mockKeycloak.clearToken.mockReset();
    mockKeycloak.login.mockReset();
    mockKeycloak.logout.mockReset();
    mockKeycloak.onAuthSuccess = undefined;
    mockKeycloak.onAuthLogout = undefined;
    mockKeycloak.onAuthRefreshSuccess = undefined;
    mockKeycloak.onAuthRefreshError = undefined;
    mockGetRealmRoles.mockReset().mockReturnValue([]);
  });

  afterEach(() => {
    cleanup();
    setAccessTokenProvider(undefined);
  });

  it("publishes the authenticated username and platform roles after initialization", async () => {
    mockKeycloak.authenticated = true;
    mockKeycloak.tokenParsed = { preferred_username: "company-user" };
    mockGetRealmRoles.mockReturnValue(["COMPANY"]);

    render(
      <AuthProvider authEnabled>
        <AuthState />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/ready:authenticated:company-user:COMPANY/)).toBeInTheDocument();
    });
  });

  it("refreshes the Keycloak token before attaching it to API requests", async () => {
    mockKeycloak.authenticated = true;
    mockKeycloak.tokenParsed = { preferred_username: "student-user" };

    render(
      <AuthProvider authEnabled>
        <AuthState />
      </AuthProvider>,
    );

    const captured: string[] = [];
    await apiClient.get("/private", { adapter: createAdapter(captured) });

    expect(mockKeycloak.updateToken).toHaveBeenCalledWith(30);
    expect(captured).toEqual(["Bearer test-access-token"]);
  });

  it("clears the local adapter session and updates React state when refresh fails", async () => {
    mockKeycloak.authenticated = true;
    mockKeycloak.tokenParsed = { preferred_username: "student-user" };
    mockGetRealmRoles.mockReturnValue(["STUDENT"]);
    const refreshError = new Error("refresh failed");
    mockKeycloak.updateToken.mockRejectedValue(refreshError);
    mockKeycloak.clearToken.mockImplementation(() => {
      mockKeycloak.authenticated = false;
      mockKeycloak.tokenParsed = undefined;
      mockGetRealmRoles.mockReturnValue([]);
    });

    render(
      <AuthProvider authEnabled>
        <AuthState />
      </AuthProvider>,
    );

    await waitFor(() => expect(mockKeycloak.onAuthRefreshError).toBeTypeOf("function"));
    await expect(apiClient.get("/private", { adapter: createAdapter([]) })).rejects.toBe(refreshError);

    await waitFor(() => {
      expect(screen.getByText(/ready:anonymous:no-user:no-role/)).toBeInTheDocument();
    });
    expect(mockKeycloak.clearToken).toHaveBeenCalledOnce();
  });

  it("keeps the public application usable when authentication is disabled", async () => {
    render(
      <AuthProvider authEnabled={false}>
        <AuthState />
      </AuthProvider>,
    );

    expect(screen.getByText(/ready:anonymous:no-user:no-role/)).toBeInTheDocument();
    expect(mockKeycloak.updateToken).not.toHaveBeenCalled();
  });
});
