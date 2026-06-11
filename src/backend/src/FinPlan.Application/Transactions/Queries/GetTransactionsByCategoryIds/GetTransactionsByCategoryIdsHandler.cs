using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionsByCategoryIds;

internal sealed class GetTransactionsByCategoryIdsHandler(ITransactionRepository transactions)
    : IQueryHandler<GetTransactionsByCategoryIdsQuery, Result<IReadOnlyList<TransactionResponse>>>
{
    public async Task<Result<IReadOnlyList<TransactionResponse>>> Handle(
        GetTransactionsByCategoryIdsQuery query, CancellationToken ct)
    {
        IReadOnlyList<Transaction> entities =
            await transactions.GetByCategoryIdsAsync(query.CategoryIds, ct);

        IReadOnlyList<TransactionResponse> response = entities
            .Select(transaction => transaction.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
