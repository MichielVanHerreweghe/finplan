import type { CodegenConfig } from "@graphql-codegen/cli";

// Introspects the live FinPlan GraphQL API and generates fully-typed urql
// documents into src/gql. Run with the backend up: `npm run codegen`.
// The endpoint can be overridden via the GRAPHQL_SCHEMA env var.
const schema = process.env.GRAPHQL_SCHEMA ?? "http://localhost:5080/graphql";

const config: CodegenConfig = {
  schema,
  documents: ["src/**/*.{ts,tsx}", "!src/gql/**/*"],
  ignoreNoDocuments: true,
  generates: {
    "./src/gql/": {
      preset: "client",
      presetConfig: {
        // Return plain typed objects instead of masked fragments — simpler to
        // render directly without useFragment unwrapping.
        fragmentMasking: false,
      },
      config: {
        // Required for verbatimModuleSyntax: emit `import type` for types.
        useTypeImports: true,
        // HotChocolate scalars: Decimal is a JS number, LocalDate is an
        // ISO `yyyy-MM-dd` string over the wire.
        scalars: {
          Decimal: "number",
          LocalDate: "string",
        },
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
