using FinPlan.Application.Transactions.Commands;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Commands;

// Shared guard for the recurring-transaction handlers: every referenced category, saving goal
// and pocket endpoint must still exist. Mirrors the checks CreateTransactionHandler performs;
// the daily job reuses it to pause a definition whose references have since disappeared.
internal static class RecurringTransactionReferences
{
    public static async Task<Result> EnsureExist(
        ITransactionCategoryRepository categories,
        ISavingGoalRepository savingGoals,
        IPocketRepository pockets,
        int? categoryId,
        int? savingGoalId,
        int? fromPocketId,
        int? toPocketId,
        CancellationToken ct)
    {
        if (categoryId is { } id && await categories.GetByIdAsync(id, ct) is null)
            return Result.Fail($"Category {id} does not exist.");

        if (savingGoalId is { } goalId && await savingGoals.GetByIdAsync(goalId, ct) is null)
            return Result.Fail($"Saving goal {goalId} does not exist.");

        return await TransactionPockets.EnsureExist(pockets, fromPocketId, toPocketId, ct);
    }
}
