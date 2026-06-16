using FinPlan.Application.Common.Messaging;
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
        IReadOnlyList<ActivityResponse> response = entities
            .Select(activity => activity.ToResponse(usersById, [], []))
            .ToList();

        return Result.Ok(response);
    }
}
