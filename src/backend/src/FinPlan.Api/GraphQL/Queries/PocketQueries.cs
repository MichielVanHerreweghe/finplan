using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FinPlan.Application.Pockets.Queries.GetPocketById;
using FinPlan.Application.Pockets.Queries.GetPockets;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    public async Task<IReadOnlyList<PocketResponse>> GetPockets(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetPocketsQuery(), ct)).Unwrap();

    public async Task<PocketResponse?> GetPocket(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetPocketByIdQuery(id), ct)).UnwrapOrNull();
}
