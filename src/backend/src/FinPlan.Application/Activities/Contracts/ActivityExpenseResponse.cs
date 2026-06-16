using FinPlan.Domain.Activities;
using FinPlan.Domain.Splitting;

namespace FinPlan.Application.Activities.Contracts;

public sealed record ActivityExpenseResponse(
    int Id,
    int ActivityId,
    string Description,
    DateOnly Date,
    decimal Amount,
    int PaidByUserId,
    SplitType SplitType,
    IReadOnlyList<ActivityExpenseSplitResponse> Splits);

public sealed record ActivityExpenseSplitResponse(int UserId, decimal Amount, decimal? Percentage);

internal static class ActivityExpenseMapping
{
    public static ActivityExpenseResponse ToResponse(this ActivityExpense expense) =>
        new(expense.Id,
            expense.ActivityId,
            expense.Description,
            expense.Date,
            expense.Amount,
            expense.PaidByUserId,
            expense.SplitType,
            expense.Splits
                .Select(split => new ActivityExpenseSplitResponse(split.UserId, split.Amount, split.Percentage))
                .ToList());
}
