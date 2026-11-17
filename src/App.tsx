import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RoleDashboardPage } from "./pages/RoleDashboardPage";
export default function App() { return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/unauthorized" element={<UnauthorizedPage />} /><Route element={<AppLayout />}><Route path="/" element={<DashboardPage />} /><Route path="/student/*" element={<ProtectedRoute roles={["STUDENT"]}><RoleDashboardPage role="STUDENT" /></ProtectedRoute>} /><Route path="/company/*" element={<ProtectedRoute roles={["COMPANY"]}><RoleDashboardPage role="COMPANY" /></ProtectedRoute>} /><Route path="/supervisor/*" element={<ProtectedRoute roles={["SUPERVISOR"]}><RoleDashboardPage role="SUPERVISOR" /></ProtectedRoute>} /><Route path="/admin/*" element={<ProtectedRoute roles={["ADMIN"]}><RoleDashboardPage role="ADMIN" /></ProtectedRoute>} /></Route><Route path="/404" element={<NotFoundPage />} /><Route path="*" element={<Navigate to="/404" replace />} /></Routes>; }