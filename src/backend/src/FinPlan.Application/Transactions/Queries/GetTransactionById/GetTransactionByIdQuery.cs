using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionById;

public sealed record GetTransactionByIdQuery(int Id) : IQuery<Result<TransactionResponse>>;
