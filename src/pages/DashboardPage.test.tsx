import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";
import type { AuthContextValue } from "../auth/types";
import { DashboardPage } from "./DashboardPage";

const baseAuth: AuthContextValue = {
  isAuthenticated: false,
  isLoading: false,
  authEnabled: true,
  roles: [],
  login: vi.fn(),
  logout: vi.fn(),
  getToken: vi.fn(),
};

function renderPage(auth: AuthContextValue = baseAuth) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("DashboardPage public overview", () => {
  it("explains the platform and its core placement workflow", () => {
    renderPage();

    expect(screen.getByRole("heading", {
      name: /bring every placement into one connected workspace/i,
    })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /universities & coordinators/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Students" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /employers & supervisors/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /from first application to final review/i })).toBeInTheDocument();
  });

  it("offers visitors a working sign-in route and platform section link", () => {
    renderPage();

    expect(screen.getByRole("link", { name: /sign in to your workspace/i })).toHaveAttribute("href", "/login");
    expect(screen.getByRole("link", { name: /explore the platform/i })).toHaveAttribute("href", "#platform");
  });

  it("routes an authenticated company user to the company workspace", () => {
    renderPage({
      ...baseAuth,
      isAuthenticated: true,
      roles: ["COMPANY"],
      username: "company-user",
    });

    expect(screen.getByRole("link", { name: /open your workspace/i })).toHaveAttribute("href", "/company");
    expect(screen.queryByRole("link", { name: /sign in to your workspace/i })).not.toBeInTheDocument();
  });

  it("does not invent a workspace when a signed-in user has no platform role", () => {
    renderPage({ ...baseAuth, isAuthenticated: true });

    expect(screen.getByRole("status")).toHaveTextContent(/role has not been assigned/i);
  });
});
