using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Groups.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Groups.Queries.GetMyContexts;

// The contexts the acting user can switch between: their Personal owner plus every group they
// belong to. Keyed on the acting user (not the active owner), so it works regardless of which
// context is currently selected — the switcher must render before a context is chosen.
internal sealed class GetMyContextsHandler(
    IUserRepository users,
    IGroupRepository groups,
    ICurrentUserProvider currentUser)
    : IQueryHandler<GetMyContextsQuery, Result<IReadOnlyList<OwnerContextResponse>>>
{
    public async Task<Result<IReadOnlyList<OwnerContextResponse>>> Handle(
        GetMyContextsQuery query, CancellationToken ct)
    {
        User? user = await users.GetByIdAsync(currentUser.CurrentUserId, ct);

        if (user is null)
            return Result.Fail<IReadOnlyList<OwnerContextResponse>>("No authenticated user.");

        IReadOnlyList<Group> memberships = await groups.GetForUserAsync(user.Id, ct);

        List<OwnerContextResponse> contexts =
        [
            new(user.OwnerId, OwnerKind.Personal, "Personal"),
            .. memberships.Select(group => new OwnerContextResponse(group.OwnerId, OwnerKind.Group, group.Name)),
        ];

        return Result.Ok<IReadOnlyList<OwnerContextResponse>>(contexts);
    }
}
