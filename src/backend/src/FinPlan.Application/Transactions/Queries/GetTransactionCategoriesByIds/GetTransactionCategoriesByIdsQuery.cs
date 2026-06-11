using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategoriesByIds;

// Batch read backing the Transaction.category DataLoader. The DataLoader collects every
// distinct CategoryId requested in a single GraphQL operation and resolves them in one query.
public sealed record GetTransactionCategoriesByIdsQuery(IReadOnlyList<int> Ids)
    : IQuery<Result<IReadOnlyList<TransactionCategoryResponse>>>;
