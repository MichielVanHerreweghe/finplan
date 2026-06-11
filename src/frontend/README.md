# FinPlan Frontend

A type-safe single-page app for managing FinPlan transactions and categories.

- **React 18 + Vite + TypeScript**
- **urql + GraphQL Code Generator** — typed operations generated from the live API schema
- **Tailwind CSS v4 + shadcn/ui** components

## Prerequisites

The frontend talks to the FinPlan GraphQL API. Start the backend first so it is
reachable at `http://localhost:5080/graphql` (it needs PostgreSQL — see the
backend's `appsettings.json` for the connection string):

```bash
# from src/backend/src/FinPlan.Api
dotnet run
```

## Getting started

```bash
npm install

# Generate typed GraphQL hooks from the live schema (backend must be running).
# The generated output lives in src/gql and is committed, so this is only
# needed after changing operations in src/graphql/operations.ts or the schema.
npm run codegen

npm run dev      # http://localhost:5173
```

`vite.config.ts` proxies `/graphql` to the backend, so the browser stays
same-origin and no CORS configuration is required on the API.

## Scripts

| Script               | Description                                        |
| -------------------- | -------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server with the GraphQL proxy.  |
| `npm run build`      | Type-check and build the production bundle.        |
| `npm run preview`    | Preview the production build.                      |
| `npm run codegen`    | Regenerate typed GraphQL code (needs the backend). |
| `npm run codegen:watch` | Watch mode for codegen.                         |
| `npm run lint`       | Run ESLint.                                         |

## Structure

```
src/
  components/ui/      shadcn/ui primitives
  features/
    transactions/     transactions list, form dialog
    categories/       categories list, form dialog, shared query hook
  graphql/operations.ts  all GraphQL documents (source for codegen)
  gql/               generated, type-safe GraphQL code (committed)
  lib/               urql client, formatting, error helpers
```

To override the schema endpoint used by codegen:
`GRAPHQL_SCHEMA=http://host:port/graphql npm run codegen`.
