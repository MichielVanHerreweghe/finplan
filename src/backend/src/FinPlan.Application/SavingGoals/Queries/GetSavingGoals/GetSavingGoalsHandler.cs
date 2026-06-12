using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoals;

internal sealed class GetSavingGoalsHandler(
    ISavingGoalRepository savingGoals,
    ITransactionRepository transactions)
    : IQueryHandler<GetSavingGoalsQuery, Result<IReadOnlyList<SavingGoalResponse>>>
{
    public async Task<Result<IReadOnlyList<SavingGoalResponse>>> Handle(
        GetSavingGoalsQuery query, CancellationToken ct)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        IReadOnlyList<SavingGoal> entities = await savingGoals.GetAsync(ct);

        int[] goalIds = entities.Select(goal => goal.Id).ToArray();
        IReadOnlyDictionary<int, decimal> saved =
            await transactions.GetSavedAmountsByGoalIdsAsync(goalIds, ct);

        IReadOnlyList<SavingGoalResponse> response = entities
            .Select(goal => goal.ToResponse(today, saved.GetValueOrDefault(goal.Id)))
            .ToList();

        return Result.Ok(response);
    }
}
