using FinPlan.Application.Common.Messaging;
using FinPlan.Application.RecurringTransactions.Contracts;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Queries.GetRecurringTransactions;

public sealed record GetRecurringTransactionsQuery
    : IQuery<Result<IReadOnlyList<RecurringTransactionResponse>>>;
