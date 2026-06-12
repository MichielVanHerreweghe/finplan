using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionsByPocketId;

public sealed record GetTransactionsByPocketIdQuery(int PocketId)
    : IQuery<Result<IReadOnlyList<TransactionResponse>>>;
