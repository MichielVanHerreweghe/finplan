using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategoriesByIds;

internal sealed class GetTransactionCategoriesByIdsHandler(ITransactionCategoryRepository categories)
    : IQueryHandler<GetTransactionCategoriesByIdsQuery, Result<IReadOnlyList<TransactionCategoryResponse>>>
{
    public async Task<Result<IReadOnlyList<TransactionCategoryResponse>>> Handle(
        GetTransactionCategoriesByIdsQuery query, CancellationToken ct)
    {
        IReadOnlyList<TransactionCategory> entities =
            await categories.GetByIdsAsync(query.Ids, ct);

        IReadOnlyList<TransactionCategoryResponse> response = entities
            .Select(category => category.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
