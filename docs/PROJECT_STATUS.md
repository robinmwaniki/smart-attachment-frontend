# Frontend Project Status and Progress

**Overall status: IN PROGRESS**  
**Last updated: 19 November 2026**  
**Integration branch: `develop`**  
**Deployment: PAUSED**

## Product direction

Deliver a polished, responsive frontend for a university attachment and internship coordination platform. The main user groups are university administrators/coordinators, students, workplace supervisors and company/employer representatives.

The public overview communicates the product's value. It does not imply that all authenticated workflows or role dashboards are complete.

## Delivered and merged into develop

- Public product overview with distinct value propositions for universities, students and employers.
- Placement lifecycle explanation covering opportunities, applications, placements, supervision, logbooks/attendance and evaluation.
- Illustrative workspace preview that does not fabricate real customer logos, testimonials or adoption metrics.
- Responsive navigation, accessible content structure and reduced-motion support.
- Keycloak initialization before React rendering, Authorization Code Flow with PKCE S256, role mapping and shared authentication state.
- Axios access-token refresh handling and safe failure states when Keycloak is unavailable.
- Regression tests for authentication lifecycle and public overview behaviour.

## In progress

- Build complete role-specific university administrator, student and company workspaces.
- Connect each dashboard to backend endpoints that have completed authentication and authorization migration.
- Keep role-specific actions hidden or disabled until the backend route is implemented and authorized; UI visibility is not a security boundary.
- Verify full login, logout, token refresh and role-specific navigation against the running local Keycloak stack.
- Add loading, empty, validation, error and permission-denied states to each operational workflow.

## Deferred / blocked

- **Sentry (issue #7):** requires a test-project DSN, CI source-map upload secret and validation that personal data, CV contents, tokens and other sensitive values are scrubbed. Do not enable replay.
- **Deployment:** intentionally paused until explicitly resumed.

## Delivery rules

1. Feature branches start from `develop`; PRs target `develop`.
2. Every feature gets its own issue and PR with clear scope, screenshots where UI changes, tests and documentation.
3. Run lint, unit tests, production build and Docker build; do not merge unless all required checks pass.
4. Keep accessibility, responsive layouts, keyboard operation and reduced-motion behaviour in acceptance criteria.
5. Update this status file and README after every meaningful change.

## Latest change log

### 19 November 2026
- Closed frontend issue #4 after merging Keycloak lifecycle regression coverage.
- Closed frontend issue #8 after merging the customer-ready public product overview.
- Confirmed frontend PR #9 and PR #10 passed lint, tests, production build and Docker build before merging into `develop`.
- Kept role-specific operational dashboard work in progress and deployment paused.
