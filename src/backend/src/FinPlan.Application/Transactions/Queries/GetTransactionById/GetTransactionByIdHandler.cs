using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionById;

internal sealed class GetTransactionByIdHandler(ITransactionRepository transactions)
    : IQueryHandler<GetTransactionByIdQuery, Result<TransactionResponse>>
{
    public async Task<Result<TransactionResponse>> Handle(GetTransactionByIdQuery query, CancellationToken ct)
    {
        Transaction? transaction = await transactions.GetByIdAsync(query.Id, ct);

        return transaction is null
            ? Result.Fail($"Transaction {query.Id} does not exist.")
            : Result.Ok(transaction.ToResponse());
    }
}
