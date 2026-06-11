using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategoryById;

internal sealed class GetTransactionCategoryByIdHandler(ITransactionCategoryRepository categories)
    : IQueryHandler<GetTransactionCategoryByIdQuery, Result<TransactionCategoryResponse>>
{
    public async Task<Result<TransactionCategoryResponse>> Handle(
        GetTransactionCategoryByIdQuery query, CancellationToken ct)
    {
        TransactionCategory? category = await categories.GetByIdAsync(query.Id, ct);

        return category is null
            ? Result.Fail($"Category {query.Id} does not exist.")
            : Result.Ok(category.ToResponse());
    }
}
