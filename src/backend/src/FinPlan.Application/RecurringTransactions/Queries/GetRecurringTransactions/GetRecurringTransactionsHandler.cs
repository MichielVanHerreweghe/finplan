using FinPlan.Application.Common.Messaging;
using FinPlan.Application.RecurringTransactions.Contracts;
using FinPlan.Domain.RecurringTransactions;
using FluentResults;

namespace FinPlan.Application.RecurringTransactions.Queries.GetRecurringTransactions;

internal sealed class GetRecurringTransactionsHandler(IRecurringTransactionRepository recurringTransactions)
    : IQueryHandler<GetRecurringTransactionsQuery, Result<IReadOnlyList<RecurringTransactionResponse>>>
{
    public async Task<Result<IReadOnlyList<RecurringTransactionResponse>>> Handle(
        GetRecurringTransactionsQuery query, CancellationToken ct)
    {
        IReadOnlyList<RecurringTransaction> entities = await recurringTransactions.GetAsync(ct);

        IReadOnlyList<RecurringTransactionResponse> response = entities
            .Select(recurringTransaction => recurringTransaction.ToResponse())
            .ToList();

        return Result.Ok(response);
    }
}
