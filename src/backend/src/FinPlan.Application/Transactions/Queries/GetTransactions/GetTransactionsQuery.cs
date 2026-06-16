using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactions;

/// <summary>
/// Lists the current owner's transactions, with optional server-side
/// search/filter/sort. All arguments are optional; defaults return every
/// transaction newest-first.
/// </summary>
public sealed record GetTransactionsQuery(
    string? Search = null,
    TransactionType? Type = null,
    int? CategoryId = null,
    bool Uncategorized = false,
    DateOnly? FromDate = null,
    DateOnly? ToDate = null,
    TransactionSort Sort = TransactionSort.DateDesc)
    : IQuery<Result<IReadOnlyList<TransactionResponse>>>;
