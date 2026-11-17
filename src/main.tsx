import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import { initializeKeycloak } from "./auth/keycloak";
import "./styles.css";
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 } } });
async function bootstrap() {
  // Initialize the OIDC adapter before rendering any protected route.
  const authEnabled = await initializeKeycloak();
  ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><QueryClientProvider client={queryClient}><AuthProvider authEnabled={authEnabled}><BrowserRouter><App /></BrowserRouter></AuthProvider></QueryClientProvider></React.StrictMode>);
}
void bootstrap();