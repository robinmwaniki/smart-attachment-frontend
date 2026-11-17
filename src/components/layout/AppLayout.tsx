import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
export function AppLayout() {
 const { isAuthenticated, username, logout } = useAuth();
 return <div className="app-shell"><header className="topbar"><Link className="brand" to="/">Smart<span>Attachment</span></Link><nav aria-label="Main navigation"><Link to="/">Overview</Link>{isAuthenticated ? <button className="text-button" onClick={() => void logout()}>Sign out</button> : <Link to="/login">Sign in</Link>}</nav>{username && <span className="user-chip">{username}</span>}</header><main className="content"><Outlet /></main><footer>Smart Attachment &amp; Internship Management Platform</footer></div>;
}