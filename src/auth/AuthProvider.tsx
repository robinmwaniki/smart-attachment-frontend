import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { keycloak, getRealmRoles } from "./keycloak";
import type { AuthContextValue } from "./types";
import { setAccessTokenProvider } from "../lib/api-client";

export const AuthContext = createContext<AuthContextValue | null>(null);

type AuthSnapshot = Pick<AuthContextValue, "isAuthenticated" | "roles" | "username">;

function readAuthSnapshot(): AuthSnapshot {
  return {
    isAuthenticated: Boolean(keycloak?.authenticated),
    roles: getRealmRoles(),
    username: keycloak?.tokenParsed?.preferred_username,
  };
}

export function AuthProvider({
  children,
  authEnabled,
  initializationError,
}: {
  children: React.ReactNode;
  authEnabled: boolean;
  initializationError?: string;
}) {
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(readAuthSnapshot);
  const [isLoading, setIsLoading] = useState(authEnabled && !initializationError);

  const syncAuthState = useCallback(() => {
    setSnapshot(readAuthSnapshot());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!authEnabled || initializationError) {
      setIsLoading(false);
      setSnapshot({ isAuthenticated: false, roles: [], username: undefined });
      setAccessTokenProvider(undefined);
      return;
    }

    // Keep the Axios boundary coupled to the active Keycloak session, not to
    // individual service modules. Tokens are held by the adapter in memory.
    const tokenProvider = async (): Promise<string | undefined> => {
      if (!keycloak?.authenticated) return undefined;
      try {
        await keycloak.updateToken(30);
        return keycloak.token;
      } catch (error) {
        keycloak.clearToken();
        syncAuthState();
        throw error;
      }
    };

    setAccessTokenProvider(tokenProvider);
    keycloak?.onAuthSuccess = syncAuthState;
    keycloak?.onAuthLogout = syncAuthState;
    keycloak?.onAuthRefreshSuccess = syncAuthState;
    keycloak?.onAuthRefreshError = syncAuthState;
    syncAuthState();

    return () => {
      setAccessTokenProvider(undefined);
      if (keycloak) {
        keycloak.onAuthSuccess = undefined;
        keycloak.onAuthLogout = undefined;
        keycloak.onAuthRefreshSuccess = undefined;
        keycloak.onAuthRefreshError = undefined;
      }
    };
  }, [authEnabled, initializationError, syncAuthState]);

  const login = useCallback(async () => {
    if (keycloak) await keycloak.login();
  }, []);

  const logout = useCallback(async () => {
    if (keycloak) await keycloak.logout({ redirectUri: window.location.origin });
  }, []);

  const getToken = useCallback(async () => {
    if (!keycloak?.authenticated) return undefined;
    await keycloak.updateToken(30);
    return keycloak.token;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...snapshot,
      isLoading,
      authEnabled,
      initializationError,
      login,
      logout,
      getToken,
    }),
    [snapshot, isLoading, authEnabled, initializationError, login, logout, getToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
