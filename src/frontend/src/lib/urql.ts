import { Client, cacheExchange, fetchExchange, mapExchange } from "urql";
import { authExchange } from "@urql/exchange-auth";

import { getAuthToken } from "@/lib/auth";

// Builds a urql client bound to one active owner context. A fresh client (with its own cache) is
// created whenever the context changes, so data never bleeds between Personal and a group.
//
// - activeOwnerId: null = Personal (no header; backend defaults to the user's personal owner);
//   a number = act as that owner (sent as X-Active-Owner, authorized server-side per request).
// - onContextDenied: called when the backend rejects the active context (403, e.g. the user left
//   the group), so the app can fall back to Personal.
export function createUrqlClient(
  activeOwnerId: number | null,
  onContextDenied: () => void,
): Client {
  return new Client({
    // Relative path so the Vite dev proxy (and same-origin deploys) route to the backend.
    url: "/graphql",
    exchanges: [
      cacheExchange,
      mapExchange({
        onError(error) {
          if (error.response?.status === 403) onContextDenied();
        },
      }),
      // Attaches the OIDC ID token as a Bearer header (recovering from auth errors) and, when a
      // group context is active, the X-Active-Owner header.
      authExchange(async (utils) => {
        let token = await getAuthToken();

        return {
          addAuthToOperation(operation) {
            const headers: Record<string, string> = {};
            if (token) headers.Authorization = `Bearer ${token}`;
            if (activeOwnerId != null) headers["X-Active-Owner"] = String(activeOwnerId);
            return Object.keys(headers).length
              ? utils.appendHeaders(operation, headers)
              : operation;
          },
          willAuthError() {
            return !token;
          },
          didAuthError(error) {
            return (
              error.response?.status === 401 ||
              error.graphQLErrors.some(
                (e) =>
                  e.extensions?.code === "AUTH_NOT_AUTHENTICATED" ||
                  e.extensions?.code === "AUTH_NOT_AUTHORIZED",
              )
            );
          },
          async refreshAuth() {
            token = await getAuthToken();
          },
        };
      }),
      fetchExchange,
    ],
  });
}
