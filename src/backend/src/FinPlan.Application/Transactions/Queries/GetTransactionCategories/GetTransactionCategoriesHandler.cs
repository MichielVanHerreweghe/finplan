using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategories;

internal sealed class GetTransactionCategoriesHandler(ITransactionCategoryRepository categories)
    : IQueryHandler<GetTransactionCategoriesQuery, Result<IReadOnlyList<TransactionCategoryResponse>>>
{
    public async Task<Result<IReadOnlyList<TransactionCategoryResponse>>> Handle(
        GetTransactionCategoriesQuery query, CancellationToken ct)
    {
        IReadOnlyList<TransactionCategory> entities = await categories.GetAsync(ct);

        IReadOnlyList<TransactionCategoryResponse> response = entities
            .Select(category => category.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
