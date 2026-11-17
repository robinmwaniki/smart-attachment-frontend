import Keycloak from "keycloak-js";
const config = { url: import.meta.env.VITE_KEYCLOAK_URL, realm: import.meta.env.VITE_KEYCLOAK_REALM, clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID };
const configured = Boolean(config.url && config.realm && config.clientId);
export const keycloak = configured ? new Keycloak(config) : undefined;
export async function initializeKeycloak(): Promise<boolean> {
  if (!keycloak) return false;
  // Public SPA clients use Authorization Code Flow with PKCE; no client secret belongs here.
  await keycloak.init({ onLoad: "check-sso", pkceMethod: "S256", checkLoginIframe: false, silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html` });
  return true;
}
export function getRealmRoles(): string[] { return keycloak?.tokenParsed?.realm_access?.roles ?? []; }