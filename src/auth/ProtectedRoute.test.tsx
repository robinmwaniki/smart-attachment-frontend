import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import type { AuthContextValue } from "./types";
import { ProtectedRoute } from "./ProtectedRoute";
const baseAuth: AuthContextValue = { isAuthenticated: false, isLoading: false, authEnabled: true, roles: [], login: vi.fn(), logout: vi.fn(), getToken: vi.fn() };
describe("ProtectedRoute", () => {
 it("redirects unauthenticated users to sign in", () => { render(<AuthContext.Provider value={baseAuth}><MemoryRouter initialEntries={["/private"]}><Routes><Route path="/private" element={<ProtectedRoute><p>Private content</p></ProtectedRoute>} /><Route path="/login" element={<p>Sign in page</p>} /></Routes></MemoryRouter></AuthContext.Provider>); expect(screen.getByText("Sign in page")).toBeInTheDocument(); });
 it("blocks authenticated users without the required role", () => { render(<AuthContext.Provider value={{ ...baseAuth, isAuthenticated: true, roles: ["STUDENT"] }}><MemoryRouter initialEntries={["/admin"]}><Routes><Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><p>Admin content</p></ProtectedRoute>} /><Route path="/unauthorized" element={<p>Access denied page</p>} /></Routes></MemoryRouter></AuthContext.Provider>); expect(screen.getByText("Access denied page")).toBeInTheDocument(); });
 it("renders content when the user has the required role", () => { render(<AuthContext.Provider value={{ ...baseAuth, isAuthenticated: true, roles: ["ADMIN"] }}><MemoryRouter><ProtectedRoute roles={["ADMIN"]}><p>Admin content</p></ProtectedRoute></MemoryRouter></AuthContext.Provider>); expect(screen.getByText("Admin content")).toBeInTheDocument(); });
});