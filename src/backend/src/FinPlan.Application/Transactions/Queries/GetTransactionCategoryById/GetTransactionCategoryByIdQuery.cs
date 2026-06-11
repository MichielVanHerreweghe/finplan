using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionCategoryById;

public sealed record GetTransactionCategoryByIdQuery(int Id) : IQuery<Result<TransactionCategoryResponse>>;
