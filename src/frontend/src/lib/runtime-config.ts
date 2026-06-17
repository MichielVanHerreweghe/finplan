// Runtime configuration for the SPA.
//
// Vite bakes `import.meta.env.VITE_*` at build time, which would force a separate image per
// environment. Instead the container serves a small `/config.js` (rendered from env vars at
// pod start — see the frontend Dockerfile) that assigns `window.__APP_CONFIG__`, so one image
// promotes across every environment. We fall back to the Vite build-time vars so `npm run dev`
// keeps working unchanged with `.env.local`.
type AppConfig = {
  OIDC_AUTHORITY?: string;
  OIDC_CLIENT_ID?: string;
  OIDC_SCOPE?: string;
};

const runtime: AppConfig =
  (window as unknown as { __APP_CONFIG__?: AppConfig }).__APP_CONFIG__ ?? {};

export const config = {
  oidcAuthority: runtime.OIDC_AUTHORITY || import.meta.env.VITE_OIDC_AUTHORITY,
  oidcClientId: runtime.OIDC_CLIENT_ID || import.meta.env.VITE_OIDC_CLIENT_ID,
  oidcScope:
    runtime.OIDC_SCOPE ||
    import.meta.env.VITE_OIDC_SCOPE ||
    "openid profile email",
};
