using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionsBySavingGoalId;

internal sealed class GetTransactionsBySavingGoalIdHandler(ITransactionRepository transactions)
    : IQueryHandler<GetTransactionsBySavingGoalIdQuery, Result<IReadOnlyList<TransactionResponse>>>
{
    public async Task<Result<IReadOnlyList<TransactionResponse>>> Handle(
        GetTransactionsBySavingGoalIdQuery query, CancellationToken ct)
    {
        IReadOnlyList<Transaction> entities =
            await transactions.GetBySavingGoalIdAsync(query.SavingGoalId, ct);

        IReadOnlyList<TransactionResponse> response = entities
            .Select(transaction => transaction.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
