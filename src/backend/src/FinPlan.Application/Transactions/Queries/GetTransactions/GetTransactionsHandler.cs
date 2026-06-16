using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactions;

internal sealed class GetTransactionsHandler(ITransactionRepository transactions)
    : IQueryHandler<GetTransactionsQuery, Result<IReadOnlyList<TransactionResponse>>>
{
    public async Task<Result<IReadOnlyList<TransactionResponse>>> Handle(
        GetTransactionsQuery query, CancellationToken ct)
    {
        IReadOnlyList<Transaction> entities = await transactions.GetAsync(ct);

        IReadOnlyList<TransactionResponse> response = entities
            .ApplySearch(query.Search)
            .ApplyType(query.Type)
            .ApplyCategory(query.CategoryId, query.Uncategorized)
            .ApplyDateRange(query.FromDate, query.ToDate)
            .ApplySort(query.Sort)
            .Select(transaction => transaction.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
