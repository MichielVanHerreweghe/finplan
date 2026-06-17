import {
  UserManager,
  WebStorageStateStore,
  type UserManagerSettings,
} from "oidc-client-ts";

import { config } from "@/lib/runtime-config";

const authority = config.oidcAuthority;
const clientId = config.oidcClientId;
const scope = config.oidcScope;

if (!authority || !clientId) {
  // Fail loudly in dev rather than surfacing a cryptic OIDC discovery error later.
  console.error(
    "Missing OIDC config: set VITE_OIDC_AUTHORITY and VITE_OIDC_CLIENT_ID in .env.local",
  );
}

export const oidcSettings: UserManagerSettings = {
  authority: authority ?? "",
  client_id: clientId ?? "",
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: window.location.origin,
  // Authorization Code + PKCE.
  response_type: "code",
  scope,
  // Persist across reloads so a refresh doesn't force a re-login.
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
};

// Shared instance so the urql auth exchange (which lives outside React) and react-oidc-context
// read from the same token store.
export const userManager = new UserManager(oidcSettings);

// The backend validates the ID token (uniform across Google/Entra), so that is what we send.
export async function getAuthToken(): Promise<string | null> {
  const user = await userManager.getUser();
  if (!user || user.expired) return null;
  return user.id_token ?? null;
}
