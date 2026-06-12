using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Contracts;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Queries.GetSavingGoalById;

internal sealed class GetSavingGoalByIdHandler(
    ISavingGoalRepository savingGoals,
    ITransactionRepository transactions)
    : IQueryHandler<GetSavingGoalByIdQuery, Result<SavingGoalResponse>>
{
    public async Task<Result<SavingGoalResponse>> Handle(GetSavingGoalByIdQuery query, CancellationToken ct)
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.UtcNow);

        SavingGoal? savingGoal = await savingGoals.GetByIdAsync(query.Id, ct);

        if (savingGoal is null)
            return Result.Fail($"Saving goal {query.Id} does not exist.");

        IReadOnlyDictionary<int, decimal> saved =
            await transactions.GetSavedAmountsByGoalIdsAsync([savingGoal.Id], ct);

        return Result.Ok(savingGoal.ToResponse(today, saved.GetValueOrDefault(savingGoal.Id)));
    }
}
