using FinPlan.Domain.Transactions;

namespace FinPlan.Application.Transactions.Contracts;

public sealed record TransactionResponse(
    int Id,
    string Name,
    DateOnly Date,
    decimal Amount,
    TransactionType Type,
    int? CategoryId,
    int? FromPocketId,
    int? ToPocketId,
    int? SavingGoalId);

internal static class TransactionMapping
{
    public static TransactionResponse ToResponse(this Transaction transaction) =>
        new(transaction.Id,
            transaction.Name,
            transaction.Date,
            transaction.Amount,
            transaction.Type,
            transaction.CategoryId,
            transaction.FromPocketId,
            transaction.ToPocketId,
            transaction.SavingGoalId);
}
