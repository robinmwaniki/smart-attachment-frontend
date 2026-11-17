import Keycloak from "keycloak-js";

const config = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
};

export const isKeycloakConfigured = Boolean(config.url && config.realm && config.clientId);
export const keycloak = isKeycloakConfigured ? new Keycloak(config) : undefined;

let initialization: Promise<boolean> | undefined;

/**
 * Share one initialization promise across callers. Keycloak's adapter must not
 * be initialized more than once for a browser page.
 */
export function initializeKeycloak(): Promise<boolean> {
  if (!keycloak) return Promise.resolve(false);
  initialization ??= keycloak
    .init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    })
    .then(() => true)
    .catch((error: unknown) => {
      initialization = undefined;
      throw error;
    });
  return initialization;
}

const SUPPORTED_ROLES = new Set(["STUDENT", "COMPANY", "SUPERVISOR", "ADMIN"]);

export function getRealmRoles(): Array<"STUDENT" | "COMPANY" | "SUPERVISOR" | "ADMIN"> {
  const roles = keycloak?.tokenParsed?.realm_access?.roles ?? [];
  return [...new Set(roles.filter((role): role is "STUDENT" | "COMPANY" | "SUPERVISOR" | "ADMIN" => SUPPORTED_ROLES.has(role)))];
}
