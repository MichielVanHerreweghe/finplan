using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Activities.Contracts;
using FinPlan.Domain.Common;
using FinPlan.Domain.Activities;
using FluentResults;

namespace FinPlan.Application.Activities.Queries.GetActivityExpenses;

internal sealed class GetActivityExpensesHandler(
    IActivityRepository activities,
    IActivityExpenseRepository expenses,
    ICurrentOwnerProvider currentOwner)
    : IQueryHandler<GetActivityExpensesQuery, Result<IReadOnlyList<ActivityExpenseResponse>>>
{
    public async Task<Result<IReadOnlyList<ActivityExpenseResponse>>> Handle(
        GetActivityExpensesQuery query, CancellationToken ct)
    {
        // Authorize via membership before exposing the activity's expenses.
        Activity? activity = await activities.GetByIdForUserAsync(query.ActivityId, currentOwner.CurrentOwnerId, ct);

        if (activity is null)
            return Result.Fail<IReadOnlyList<ActivityExpenseResponse>>($"Activity {query.ActivityId} does not exist.");

        IReadOnlyList<ActivityExpense> activityExpenses = await expenses.GetByActivityAsync(query.ActivityId, ct);

        IReadOnlyList<ActivityExpenseResponse> response = activityExpenses
            .Select(expense => expense.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
