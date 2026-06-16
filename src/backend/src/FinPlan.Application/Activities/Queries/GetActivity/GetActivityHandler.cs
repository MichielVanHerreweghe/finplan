using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Activities.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Activities.Queries.GetActivity;

internal sealed class GetActivityHandler(
    IActivityRepository activities,
    IActivityExpenseRepository expenses,
    IUserRepository users,
    ICurrentOwnerProvider currentOwner)
    : IQueryHandler<GetActivityQuery, Result<ActivityResponse>>
{
    public async Task<Result<ActivityResponse>> Handle(GetActivityQuery query, CancellationToken ct)
    {
        Activity? activity = await activities.GetByIdForUserAsync(query.Id, currentOwner.CurrentOwnerId, ct);

        if (activity is null)
            return Result.Fail<ActivityResponse>($"Activity {query.Id} does not exist.");

        IReadOnlyList<ActivityExpense> activityExpenses = await expenses.GetByActivityAsync(activity.Id, ct);
        IReadOnlyList<ActivityBalanceResponse> balances = ActivityBalances.Compute(activity, activityExpenses);
        IReadOnlyList<ActivitySettlementResponse> settlements = ActivitySettlements.Compute(balances);

        int[] userIds = activity.Members.Select(member => member.UserId).ToArray();
        IReadOnlyDictionary<int, User> usersById =
            (await users.GetByIdsAsync(userIds, ct)).ToDictionary(user => user.Id);

        return Result.Ok(activity.ToResponse(usersById, balances, settlements));
    }
}
