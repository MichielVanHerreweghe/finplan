using FinPlan.Domain.RecurringTransactions;
using FinPlan.Domain.Transactions;

namespace FinPlan.Application.RecurringTransactions.Contracts;

public sealed record RecurringTransactionResponse(
    int Id,
    string Name,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId,
    string RecurrenceRule,
    DateOnly StartDate,
    DateOnly? NextOccurrence,
    DateOnly? LastGeneratedDate,
    bool IsPaused,
    string? PauseReason);

internal static class RecurringTransactionMapping
{
    public static RecurringTransactionResponse ToResponse(this RecurringTransaction recurringTransaction) =>
        new(recurringTransaction.Id,
            recurringTransaction.Name,
            recurringTransaction.Amount,
            recurringTransaction.Type,
            recurringTransaction.CategoryId,
            recurringTransaction.FromPocketId,
            recurringTransaction.ToPocketId,
            recurringTransaction.SavingGoalId,
            recurringTransaction.RecurrenceRule,
            recurringTransaction.StartDate,
            recurringTransaction.NextOccurrence,
            recurringTransaction.LastGeneratedDate,
            recurringTransaction.IsPaused,
            recurringTransaction.PauseReason);
}
