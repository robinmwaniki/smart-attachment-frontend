import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { keycloak, getRealmRoles } from "./keycloak";
import type { AuthContextValue, AppRole } from "./types";
import { setAccessTokenProvider } from "../lib/api-client";
export const AuthContext = createContext<AuthContextValue | null>(null);
const APP_ROLES: AppRole[] = ["STUDENT", "COMPANY", "SUPERVISOR", "ADMIN"];
export function AuthProvider({ children, authEnabled }: { children: React.ReactNode; authEnabled: boolean }) {
  const [, refresh] = useState(0);
  useEffect(() => { setAccessTokenProvider(async () => { if (!keycloak?.authenticated) return undefined; await keycloak.updateToken(30); return keycloak.token; }); }, []);
  const login = useCallback(async () => { if (keycloak) await keycloak.login(); }, []);
  const logout = useCallback(async () => { if (keycloak) await keycloak.logout({ redirectUri: window.location.origin }); }, []);
  const getToken = useCallback(async () => { if (!keycloak?.authenticated) return undefined; await keycloak.updateToken(30); return keycloak.token; }, []);
  const roles = getRealmRoles().filter((role): role is AppRole => APP_ROLES.includes(role as AppRole));
  const value = useMemo<AuthContextValue>(() => ({ isAuthenticated: Boolean(keycloak?.authenticated), isLoading: false, authEnabled, roles, username: keycloak?.tokenParsed?.preferred_username, login, logout, getToken }), [authEnabled, roles.join(","), login, logout, getToken]);
  // Refresh context state when Keycloak reports login, logout or token renewal.
  if (keycloak) { keycloak.onAuthSuccess = () => refresh((n) => n + 1); keycloak.onAuthLogout = () => refresh((n) => n + 1); keycloak.onAuthRefreshSuccess = () => refresh((n) => n + 1); }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}