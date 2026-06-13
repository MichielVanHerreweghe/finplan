using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Groups.Contracts;
using FinPlan.Application.Groups.Queries.GetGroups;
using FinPlan.Application.Groups.Queries.GetMyContexts;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    // The contexts the current user can switch between (Personal + their groups).
    public async Task<IReadOnlyList<OwnerContextResponse>> GetMyContexts(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetMyContextsQuery(), ct)).Unwrap();

    // The current user's groups with members, for the management page.
    public async Task<IReadOnlyList<GroupResponse>> GetGroups(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetGroupsQuery(), ct)).Unwrap();
}
