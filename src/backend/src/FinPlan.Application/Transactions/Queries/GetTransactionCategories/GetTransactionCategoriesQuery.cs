using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategories;

public sealed record GetTransactionCategoriesQuery : IQuery<Result<IReadOnlyList<TransactionCategoryResponse>>>;
