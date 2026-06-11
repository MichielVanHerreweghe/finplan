import { Client, cacheExchange, fetchExchange } from "urql";

// Targets the relative "/graphql" path so the Vite dev proxy (and any future
// same-origin deployment) routes it to the backend without CORS concerns.
export const urqlClient = new Client({
  url: "/graphql",
  exchanges: [cacheExchange, fetchExchange],
});
