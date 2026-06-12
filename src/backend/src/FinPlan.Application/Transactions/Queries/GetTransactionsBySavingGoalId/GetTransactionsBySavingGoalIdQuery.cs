using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Contracts;
using FluentResults;

namespace FinPlan.Application.Transactions.Queries.GetTransactionsBySavingGoalId;

public sealed record GetTransactionsBySavingGoalIdQuery(int SavingGoalId)
    : IQuery<Result<IReadOnlyList<TransactionResponse>>>;
