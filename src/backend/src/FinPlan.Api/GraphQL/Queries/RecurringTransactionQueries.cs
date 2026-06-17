using FinPlan.Application.Common.Messaging;
using FinPlan.Application.RecurringTransactions.Contracts;
using FinPlan.Application.RecurringTransactions.Queries.GetRecurringTransactionById;
using FinPlan.Application.RecurringTransactions.Queries.GetRecurringTransactions;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    public async Task<IReadOnlyList<RecurringTransactionResponse>> GetRecurringTransactions(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetRecurringTransactionsQuery(), ct)).Unwrap();

    public async Task<RecurringTransactionResponse?> GetRecurringTransaction(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetRecurringTransactionByIdQuery(id), ct)).UnwrapOrNull();
}
