import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockKeycloak, mockKeycloakConstructor } = vi.hoisted(() => {
  const instance = {
    init: vi.fn(),
    authenticated: false,
    tokenParsed: undefined as Record<string, unknown> | undefined,
    token: "test-token",
    updateToken: vi.fn(),
    clearToken: vi.fn(),
  };

  return {
    mockKeycloak: instance,
    mockKeycloakConstructor: vi.fn(() => instance),
  };
});

vi.mock("keycloak-js", () => ({
  default: mockKeycloakConstructor,
}));

describe("Keycloak browser adapter", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("VITE_KEYCLOAK_URL", "http://localhost:8180");
    vi.stubEnv("VITE_KEYCLOAK_REALM", "smart-attachment");
    vi.stubEnv("VITE_KEYCLOAK_CLIENT_ID", "smart-attachment-frontend");
    mockKeycloak.authenticated = false;
    mockKeycloak.tokenParsed = undefined;
    mockKeycloak.init.mockReset().mockResolvedValue(true);
    mockKeycloakConstructor.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("initializes once with silent SSO and PKCE S256", async () => {
    const { initializeKeycloak } = await import("./keycloak");

    const results = await Promise.all([
      initializeKeycloak(),
      initializeKeycloak(),
      initializeKeycloak(),
    ]);

    expect(results).toEqual([true, true, true]);
    expect(mockKeycloakConstructor).toHaveBeenCalledTimes(1);
    expect(mockKeycloak.init).toHaveBeenCalledTimes(1);
    expect(mockKeycloak.init).toHaveBeenCalledWith(expect.objectContaining({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
    }));
  });

  it("allows initialization to be retried after an adapter failure", async () => {
    const { initializeKeycloak } = await import("./keycloak");
    const failure = new Error("Keycloak is unavailable");
    mockKeycloak.init.mockRejectedValueOnce(failure).mockResolvedValueOnce(true);

    await expect(initializeKeycloak()).rejects.toBe(failure);
    await expect(initializeKeycloak()).resolves.toBe(true);

    expect(mockKeycloak.init).toHaveBeenCalledTimes(2);
  });

  it("maps only supported, unique platform realm roles", async () => {
    mockKeycloak.tokenParsed = {
      realm_access: {
        roles: ["STUDENT", "COMPANY", "STUDENT", "offline_access", "ADMIN"],
      },
    };

    const { getRealmRoles } = await import("./keycloak");

    expect(getRealmRoles()).toEqual(["STUDENT", "COMPANY", "ADMIN"]);
  });

  it("keeps public pages usable when Keycloak configuration is missing", async () => {
    vi.stubEnv("VITE_KEYCLOAK_URL", "");
    vi.resetModules();

    const { isKeycloakConfigured, keycloak, initializeKeycloak } = await import("./keycloak");

    expect(isKeycloakConfigured).toBe(false);
    expect(keycloak).toBeUndefined();
    await expect(initializeKeycloak()).resolves.toBe(false);
    expect(mockKeycloakConstructor).not.toHaveBeenCalled();
  });
});
