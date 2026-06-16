using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Common.Queries;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategories;

public sealed record GetTransactionCategoriesQuery(
    string? Search = null,
    NameSort Sort = NameSort.NameAsc)
    : IQuery<Result<IReadOnlyList<TransactionCategoryResponse>>>;
