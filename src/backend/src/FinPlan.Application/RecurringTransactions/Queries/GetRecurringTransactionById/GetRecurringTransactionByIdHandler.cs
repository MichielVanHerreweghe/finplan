using FinPlan.Application.Common.Messaging;
using FinPlan.Application.RecurringTransactions.Contracts;
using FinPlan.Domain.RecurringTransactions;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Queries.GetRecurringTransactionById;

internal sealed class GetRecurringTransactionByIdHandler(IRecurringTransactionRepository recurringTransactions)
    : IQueryHandler<GetRecurringTransactionByIdQuery, Result<RecurringTransactionResponse>>
{
    public async Task<Result<RecurringTransactionResponse>> Handle(
        GetRecurringTransactionByIdQuery query, CancellationToken ct)
    {
        RecurringTransaction? recurringTransaction = await recurringTransactions.GetByIdAsync(query.Id, ct);

        return recurringTransaction is null
            ? Result.Fail($"Recurring transaction {query.Id} does not exist.")
            : Result.Ok(recurringTransaction.ToResponse());
    }
}
