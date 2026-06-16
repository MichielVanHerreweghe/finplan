using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Application.Transactions.Queries.GetTransactions;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionsByPocketId;

public sealed record GetTransactionsByPocketIdQuery(
    int PocketId,
    string? Search = null,
    TransactionType? Type = null,
    TransactionSort Sort = TransactionSort.DateDesc)
    : IQuery<Result<IReadOnlyList<TransactionResponse>>>;
