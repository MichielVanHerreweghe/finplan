import { Client, cacheExchange, fetchExchange } from "urql";
import { authExchange } from "@urql/exchange-auth";

import { getAuthToken } from "@/lib/auth";

// Targets the relative "/graphql" path so the Vite dev proxy (and any future
// same-origin deployment) routes it to the backend without CORS concerns.
export const urqlClient = new Client({
  url: "/graphql",
  exchanges: [
    cacheExchange,
    // Attaches the OIDC ID token as a Bearer header and recovers from auth errors by
    // re-reading the (possibly silently renewed) token from the shared UserManager.
    authExchange(async (utils) => {
      let token = await getAuthToken();

      return {
        addAuthToOperation(operation) {
          if (!token) return operation;
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
          });
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
