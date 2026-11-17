import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
export function LoginPage() {
 const auth = useAuth(); const location = useLocation(); const destination = (location.state as { from?: string } | null)?.from ?? "/";
 if (auth.isAuthenticated) return <Navigate to={destination} replace />;
 return <section className="auth-card"><p className="eyebrow">WELCOME BACK</p><h1>Sign in</h1><p className="muted">Your organization’s secure identity provider handles authentication.</p>{!auth.authEnabled ? <p className="notice">Keycloak is not configured. Copy .env.example to .env and set the Keycloak connection values.</p> : <button className="primary-button" onClick={() => void auth.login()}>Continue with Keycloak</button>}</section>;
}