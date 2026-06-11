using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactions;

public sealed record GetTransactionsQuery : IQuery<Result<IReadOnlyList<TransactionResponse>>>;
