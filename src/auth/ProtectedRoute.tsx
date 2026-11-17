import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { AppRole } from "./types";
import { useAuth } from "./useAuth";

export function ProtectedRoute({ children, roles }: { children: ReactNode; roles?: AppRole[] }) {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) {
    return <div className="notice" role="status">Checking your session…</div>;
  }

  if (!auth.authEnabled) {
    return <div className="notice" role="status">Authentication is not configured. Set the Keycloak values in your local .env file.</div>;
  }

  if (auth.initializationError) {
    return <div className="notice" role="alert">The sign-in service is currently unavailable. Check that Keycloak is running and reload this page.</div>;
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !roles.some((role) => auth.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
