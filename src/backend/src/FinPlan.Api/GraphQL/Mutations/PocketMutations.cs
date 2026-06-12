using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Commands.CreatePocket;
using FinPlan.Application.Pockets.Commands.DeletePocket;
using FinPlan.Application.Pockets.Commands.UpdatePocket;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    // Without this the mutation convention names the payload field after the return type ("int").
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreatePocket(
        CreatePocketInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new CreatePocketCommand(input.Name, input.Description, input.ParentPocketId, input.StartingAmount),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> UpdatePocket(
        UpdatePocketInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new UpdatePocketCommand(input.Id, input.Name, input.Description, input.ParentPocketId, input.StartingAmount),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeletePocket(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeletePocketCommand(id), ct)).Unwrap();
}
