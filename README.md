# Smart Attachment Frontend

React + TypeScript single-page application for the Smart Attachment & Internship Management Platform. This repository is separate from the Spring Boot API.

## Stack
- React 19, TypeScript (strict), Vite
- React Router, TanStack Query and Axios
- Keycloak JS (OIDC Authorization Code Flow + PKCE S256)
- Tailwind CSS v4
- Vitest and React Testing Library
- Docker + Nginx; GitHub Actions CI

## Requirements
- Node.js 22.12+ and npm 10.9+
- A running backend API and Keycloak realm for authenticated workflows

## Local development
1. Clone the repository and switch to `develop` for integration work.
2. Install dependencies: `npm install`.
3. Copy `.env.example` to `.env` and set the public frontend configuration.
4. Start Vite: `npm run dev`.

The public overview works without Keycloak. Protected areas remain unavailable until Keycloak is configured and reachable.

## Environment
| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Backend API base URL, e.g. `http://localhost:8080/api/v1` |
| `VITE_KEYCLOAK_URL` | Keycloak base URL |
| `VITE_KEYCLOAK_REALM` | Realm name |
| `VITE_KEYCLOAK_CLIENT_ID` | Public SPA client ID |

Every `VITE_*` value is exposed to the browser. Never put passwords, client secrets, private keys or database credentials in these variables. Configure Keycloak as a public client, enable Standard Flow, require PKCE S256, and register exact development/production redirect URIs and web origins.

## Authentication startup
- The OIDC adapter is initialized once before React renders. This prevents protected routes from briefly treating an unresolved session as anonymous.
- Login, logout and token-refresh events update the shared authentication context.
- The Axios API client obtains a current access token from the Keycloak adapter and refreshes it before protected requests.
- Tokens are not copied into localStorage or sessionStorage by application code.
- If Keycloak is not configured, the public overview remains available and protected routes explain that authentication is unavailable.
- If Keycloak is configured but cannot be reached, protected routes show an availability message instead of silently treating the configuration as disabled.

Keycloak server/realm setup and Spring Boot Resource Server validation are tracked in the backend repository's issue #20:
https://github.com/robinmwaniki/Smart-Attachment_-Internship-Management-Platform/issues/20

The API must independently validate bearer tokens and enforce authorization. Hiding a route in React is not a security boundary. Application profile and workflow data remain in the backend database. Link accounts using Keycloak immutable subject (`sub`), not email.

## Quality checks
```bash
npm run lint
npm test
npm run build
npm run test:coverage
```

## Docker
```bash
docker build -t smart-attachment-frontend .
docker run --rm -p 8081:80 smart-attachment-frontend
```
Open `http://localhost:8081`.

## Project structure
- `src/auth`: Keycloak initialization, auth context and route guards
- `src/components`: shared layout and UI components
- `src/pages`: public and role landing pages
- `src/lib`: API client and cross-cutting utilities
- `.github/workflows`: CI checks

## Delivery workflow
Create feature branches from `develop`; each feature should have its own issue and pull request targeting `develop`. Promote to `main` only after integration checks and end-to-end validation pass.
