import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import type { AppRole } from "../../auth/types";

const workspaceRoutes: Partial<Record<AppRole, string>> = {
  STUDENT: "/student",
  COMPANY: "/company",
  SUPERVISOR: "/supervisor",
  ADMIN: "/admin",
};

export function AppLayout() {
  const { isAuthenticated, roles, username, logout } = useAuth();
  const workspacePath = roles.map((role) => workspaceRoutes[role]).find(Boolean);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Smart Attachment home">
          <span className="brand-mark">SA</span>
          <span className="brand-name">smart<span>attachment</span></span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="/#platform">Platform</a>
          <a href="/#audiences">Who it serves</a>
          <a href="/#how-it-works">How it works</a>
          {isAuthenticated ? (
            <>
              {workspacePath && <Link className="nav-workspace" to={workspacePath}>My workspace</Link>}
              <button className="text-button" onClick={() => void logout()}>Sign out</button>
            </>
          ) : (
            <Link className="nav-signin" to="/login">Sign in <span aria-hidden="true">↗</span></Link>
          )}
        </nav>
        {username && <span className="user-chip">{username}</span>}
      </header>
      <main className="content" id="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-brand">
          <span className="brand-mark">SA</span>
          <span>Smart Attachment</span>
        </div>
        <p>Connecting education and industry through a clearer placement journey.</p>
        <span>© {new Date().getFullYear()} Smart Attachment Platform</span>
      </footer>
    </div>
  );
}
