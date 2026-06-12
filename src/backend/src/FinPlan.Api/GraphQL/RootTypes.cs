using HotChocolate.Authorization;

// Require an authenticated user for every query and mutation field. Applied here on one partial
// declaration of each root type so the per-feature partials stay focused on their fields.
// Schema introspection is not gated by type-level authorization, so frontend codegen against
// /graphql still works without a token.
namespace FinPlan.Api.GraphQL.Queries
{
    [Authorize]
    public partial class Query;
}

namespace FinPlan.Api.GraphQL.Mutations
{
    [Authorize]
    public partial class Mutation;
}
