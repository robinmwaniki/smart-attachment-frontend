import axios from "axios";
let tokenProvider: (() => Promise<string | undefined>) | undefined;
/** Inject a Keycloak-backed token provider without coupling services to the auth adapter. */
export function setAccessTokenProvider(provider: () => Promise<string | undefined>) { tokenProvider = provider; }
export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1", timeout: 15_000, headers: { "Content-Type": "application/json", Accept: "application/json" } });
apiClient.interceptors.request.use(async (config) => { const token = await tokenProvider?.(); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });