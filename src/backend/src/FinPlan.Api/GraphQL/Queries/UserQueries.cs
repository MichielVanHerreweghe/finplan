using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Users.Contracts;
using FinPlan.Application.Users.Queries.GetMe;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    // The acting user's own profile, used by the client to gate first-login onboarding.
    public async Task<UserProfileResponse> GetMe(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetMeQuery(), ct)).Unwrap();
}
