using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionsByPocketId;

internal sealed class GetTransactionsByPocketIdHandler(ITransactionRepository transactions)
    : IQueryHandler<GetTransactionsByPocketIdQuery, Result<IReadOnlyList<TransactionResponse>>>
{
    public async Task<Result<IReadOnlyList<TransactionResponse>>> Handle(
        GetTransactionsByPocketIdQuery query, CancellationToken ct)
    {
        IReadOnlyList<Transaction> entities = await transactions.GetByPocketIdAsync(query.PocketId, ct);

        IReadOnlyList<TransactionResponse> response = entities
            .Select(transaction => transaction.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
