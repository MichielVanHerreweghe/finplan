// Development default. Empty values make runtime-config.ts fall back to the Vite build-time
// VITE_OIDC_* vars from .env.local. In production this file is overwritten at container start
// with values from the OIDC_* environment variables (see the frontend Dockerfile entrypoint).
window.__APP_CONFIG__ = {};
