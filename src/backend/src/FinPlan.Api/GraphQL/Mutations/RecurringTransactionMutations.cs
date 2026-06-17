using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.RecurringTransactions.Commands.CreateRecurringTransaction;
using FinPlan.Application.RecurringTransactions.Commands.DeleteRecurringTransaction;
using FinPlan.Application.RecurringTransactions.Commands.UpdateRecurringTransaction;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreateRecurringTransaction(
        CreateRecurringTransactionInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new CreateRecurringTransactionCommand(input.Name, input.Amount, input.Type, input.CategoryId,
                input.FromPocketId, input.ToPocketId, input.SavingGoalId, input.RecurrenceRule, input.StartDate),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> UpdateRecurringTransaction(
        UpdateRecurringTransactionInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new UpdateRecurringTransactionCommand(input.Id, input.Name, input.Amount, input.Type, input.CategoryId,
                input.FromPocketId, input.ToPocketId, input.SavingGoalId, input.RecurrenceRule, input.StartDate),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteRecurringTransaction(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteRecurringTransactionCommand(id), ct)).Unwrap();
}
