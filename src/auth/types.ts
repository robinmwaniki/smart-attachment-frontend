export type AppRole = "STUDENT" | "COMPANY" | "SUPERVISOR" | "ADMIN";

export interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  authEnabled: boolean;
  initializationError?: string;
  roles: AppRole[];
  username?: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | undefined>;
}
