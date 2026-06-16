using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Activities.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Activities.Queries.GetActivities;

internal sealed class GetActivitiesHandler(
    IActivityRepository activities,
    IUserRepository users,
    ICurrentOwnerProvider currentOwner)
    : IQueryHandler<GetActivitiesQuery, Result<IReadOnlyList<ActivityResponse>>>
{
    public async Task<Result<IReadOnlyList<ActivityResponse>>> Handle(GetActivitiesQuery query, CancellationToken ct)
    {
        IReadOnlyList<Activity> entities = await activities.GetForUserAsync(currentOwner.CurrentOwnerId, ct);

        int[] userIds = entities
            .SelectMany(activity => activity.Members.Select(member => member.UserId))
            .Distinct()
            .ToArray();
        IReadOnlyDictionary<int, User> usersById =
            (await users.GetByIdsAsync(userIds, ct)).ToDictionary(user => user.Id);

        // Balances and settlements are only computed for the single-activity view; the list keeps
        // them empty.
        IEnumerable<ActivityResponse> result = entities
            .Select(activity => activity.ToResponse(usersById, [], []));

        if (!string.IsNullOrWhiteSpace(query.Search))
            result = result.Where(activity =>
                activity.Name.Contains(query.Search.Trim(), StringComparison.OrdinalIgnoreCase));

        result = query.Sort == NameSort.NameDesc
            ? result.OrderByDescending(activity => activity.Name, StringComparer.OrdinalIgnoreCase)
            : result.OrderBy(activity => activity.Name, StringComparer.OrdinalIgnoreCase);

        IReadOnlyList<ActivityResponse> response = result.ToList();

        return Result.Ok(response);
    }
}
