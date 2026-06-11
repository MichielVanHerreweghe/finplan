using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Transactions.Commands.CreateTransactionCategory;
using FinPlan.Application.Transactions.Commands.DeleteTransactionCategory;
using FinPlan.Application.Transactions.Commands.UpdateTransactionCategory;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    // Without this the mutation convention names the payload field after the return type ("int").
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreateTransactionCategory(
        CreateTransactionCategoryInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new CreateTransactionCategoryCommand(input.Name), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> UpdateTransactionCategory(
        UpdateTransactionCategoryInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new UpdateTransactionCategoryCommand(input.Id, input.Name), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteTransactionCategory(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteTransactionCategoryCommand(id), ct)).Unwrap();
}
