using FinPlan.Domain.Transactions;

namespace FinPlan.Application.Transactions.Contracts;

public sealed record TransactionCategoryResponse(int Id, string Name);

internal static class TransactionCategoryMapping
{
    public static TransactionCategoryResponse ToResponse(this TransactionCategory category) =>
        new(category.Id, category.Name);
}
