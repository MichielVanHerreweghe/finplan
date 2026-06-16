using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Groups.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Groups.Queries.GetGroups;

// Groups the acting user belongs to, with members resolved to display names — for the group
// management page. Membership-scoped, independent of the active owner context.
internal sealed class GetGroupsHandler(
    IGroupRepository groups,
    IUserRepository users,
    ICurrentUserProvider currentUser)
    : IQueryHandler<GetGroupsQuery, Result<IReadOnlyList<GroupResponse>>>
{
    public async Task<Result<IReadOnlyList<GroupResponse>>> Handle(GetGroupsQuery query, CancellationToken ct)
    {
        IReadOnlyList<Group> entities = await groups.GetForUserAsync(currentUser.CurrentUserId, ct);

        int[] userIds = entities
            .SelectMany(group => group.Members.Select(member => member.UserId))
            .Distinct()
            .ToArray();
        IReadOnlyDictionary<int, User> usersById =
            (await users.GetByIdsAsync(userIds, ct)).ToDictionary(user => user.Id);

        IEnumerable<GroupResponse> result = entities
            .Select(group => group.ToResponse(usersById));

        if (!string.IsNullOrWhiteSpace(query.Search))
            result = result.Where(group =>
                group.Name.Contains(query.Search.Trim(), StringComparison.OrdinalIgnoreCase));

        result = query.Sort == NameSort.NameDesc
            ? result.OrderByDescending(group => group.Name, StringComparer.OrdinalIgnoreCase)
            : result.OrderBy(group => group.Name, StringComparer.OrdinalIgnoreCase);

        IReadOnlyList<GroupResponse> response = result.ToList();

        return Result.Ok(response);
    }
}
