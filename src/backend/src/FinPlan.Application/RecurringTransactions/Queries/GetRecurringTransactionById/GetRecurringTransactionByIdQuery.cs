using FinPlan.Application.Common.Messaging;
using FinPlan.Application.RecurringTransactions.Contracts;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Queries.GetRecurringTransactionById;

public sealed record GetRecurringTransactionByIdQuery(int Id)
    : IQuery<Result<RecurringTransactionResponse>>;
