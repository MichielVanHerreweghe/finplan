using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Commands.CreateTransaction;
using FinPlan.Application.Transactions.Commands.DeleteTransaction;
using FinPlan.Application.Transactions.Commands.UpdateTransaction;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    // Without this the mutation convention names the payload field after the return type ("int").
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreateTransaction(
        CreateTransactionInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new CreateTransactionCommand(input.Name, input.Date, input.Amount, input.Type, input.CategoryId,
                input.FromPocketId, input.ToPocketId, input.SavingGoalId),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> UpdateTransaction(
        UpdateTransactionInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new UpdateTransactionCommand(input.Id, input.Name, input.Date, input.Amount, input.Type, input.CategoryId,
                input.FromPocketId, input.ToPocketId, input.SavingGoalId),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteTransaction(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteTransactionCommand(id), ct)).Unwrap();
}
