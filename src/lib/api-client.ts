import axios, { type AxiosRequestConfig } from "axios";

type AccessTokenProvider = () => Promise<string | undefined>;
let tokenProvider: AccessTokenProvider | undefined;

/** Register or clear the Keycloak-backed token provider at the auth boundary. */
export function setAccessTokenProvider(provider: AccessTokenProvider | undefined): void {
  tokenProvider = provider;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1",
  timeout: 15_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

export async function attachAccessToken(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
  const token = await tokenProvider?.();
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  } else if (config.headers) {
    delete (config.headers as Record<string, unknown>).Authorization;
    delete (config.headers as Record<string, unknown>).authorization;
  }
  return config;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenProvider?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    config.headers.delete("Authorization");
  }
  return config;
});
