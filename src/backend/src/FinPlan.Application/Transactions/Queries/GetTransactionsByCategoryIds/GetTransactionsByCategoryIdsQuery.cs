using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionsByCategoryIds;

// Batch read backing the TransactionCategory.transactions DataLoader. Returns a flat list across
// all requested category ids; the DataLoader groups it back per category via TransactionResponse.CategoryId.
public sealed record GetTransactionsByCategoryIdsQuery(IReadOnlyList<int> CategoryIds)
    : IQuery<Result<IReadOnlyList<TransactionResponse>>>;
