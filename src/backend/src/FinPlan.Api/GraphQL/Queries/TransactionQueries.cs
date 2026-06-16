using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Application.Transactions.Queries.GetTransactionById;
using FinPlan.Application.Transactions.Queries.GetTransactions;
using FinPlan.Application.Transactions.Queries.GetTransactionsByPocketId;
using FinPlan.Application.Transactions.Queries.GetTransactionsBySavingGoalId;
using FinPlan.Domain.Transactions;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    public async Task<IReadOnlyList<TransactionResponse>> GetTransactions(
        ISender sender, CancellationToken ct,
        TransactionFilterInput? filter = null,
        TransactionSort sort = TransactionSort.DateDesc) =>
        (await sender.Send(
            new GetTransactionsQuery(
                filter?.Search, filter?.Type, filter?.CategoryId, filter?.Uncategorized ?? false,
                filter?.FromDate, filter?.ToDate, sort),
            ct)).Unwrap();

    public async Task<TransactionResponse?> GetTransaction(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetTransactionByIdQuery(id), ct)).UnwrapOrNull();

    public async Task<IReadOnlyList<TransactionResponse>> GetTransactionsByPocket(
        int pocketId, ISender sender, CancellationToken ct,
        string? search = null,
        TransactionType? type = null,
        TransactionSort sort = TransactionSort.DateDesc) =>
        (await sender.Send(
            new GetTransactionsByPocketIdQuery(pocketId, search, type, sort), ct)).Unwrap();

    public async Task<IReadOnlyList<TransactionResponse>> GetTransactionsBySavingGoal(
        int savingGoalId, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetTransactionsBySavingGoalIdQuery(savingGoalId), ct)).Unwrap();
}
