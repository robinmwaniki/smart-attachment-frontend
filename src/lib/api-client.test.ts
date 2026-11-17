import { afterEach, describe, expect, it, vi } from "vitest";
import type { AxiosAdapter } from "axios";
import { apiClient, setAccessTokenProvider } from "./api-client";

afterEach(() => {
  setAccessTokenProvider(undefined);
});

function createAdapter(): { adapter: AxiosAdapter; captured: Array<{ authorization: unknown }> } {
  const captured: Array<{ authorization: unknown }> = [];
  const adapter: AxiosAdapter = async (config) => {
    captured.push({ authorization: config.headers.get("Authorization") });
    return {
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  return { adapter, captured };
}

describe("apiClient authentication interceptor", () => {
  it("adds a bearer token supplied by the active auth provider", async () => {
    const { adapter, captured } = createAdapter();
    setAccessTokenProvider(async () => "test-access-token");

    await apiClient.get("/private", { adapter });

    expect(captured[0]?.authorization).toBe("Bearer test-access-token");
  });

  it("does not attach an authorization header when no provider is registered", async () => {
    const { adapter, captured } = createAdapter();

    await apiClient.get("/public", { adapter });

    expect(captured[0]?.authorization).toBeUndefined();
  });

  it("rejects the request when the token provider cannot refresh a token", async () => {
    const { adapter } = createAdapter();
    const refreshError = new Error("Token refresh failed");
    const provider = vi.fn().mockRejectedValue(refreshError);
    setAccessTokenProvider(provider);

    await expect(apiClient.get("/private", { adapter })).rejects.toBe(refreshError);
    expect(adapter).not.toHaveBeenCalled();
  });
});
