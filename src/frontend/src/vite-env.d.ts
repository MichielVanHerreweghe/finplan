/// <reference types="vite/client" />

interface ImportMetaEnv {
  // OIDC provider settings. Authority + client id come from the provider registration
  // (e.g. Google Cloud Console). Scope defaults to "openid profile email" when unset.
  readonly VITE_OIDC_AUTHORITY: string;
  readonly VITE_OIDC_CLIENT_ID: string;
  readonly VITE_OIDC_SCOPE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
