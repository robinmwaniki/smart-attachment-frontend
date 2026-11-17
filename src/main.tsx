import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import { initializeKeycloak, isKeycloakConfigured } from "./auth/keycloak";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});

async function bootstrap() {
  const authEnabled = isKeycloakConfigured;
  let initializationError: string | undefined;

  // Wait for OIDC initialization before React evaluates protected routes.
  if (authEnabled) {
    try {
      await initializeKeycloak();
    } catch (error) {
      initializationError =
        error instanceof Error ? error.message : "Unable to initialize Keycloak.";
    }
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider authEnabled={authEnabled} initializationError={initializationError}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

void bootstrap();
