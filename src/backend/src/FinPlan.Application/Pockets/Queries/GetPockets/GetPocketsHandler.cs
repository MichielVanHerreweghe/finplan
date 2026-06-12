using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Pockets.Queries.GetPockets;

internal sealed class GetPocketsHandler(
    IPocketRepository pockets,
    ITransactionRepository transactions)
    : IQueryHandler<GetPocketsQuery, Result<IReadOnlyList<PocketResponse>>>
{
    public async Task<Result<IReadOnlyList<PocketResponse>>> Handle(
        GetPocketsQuery query, CancellationToken ct)
    {
        IReadOnlyList<Pocket> entities = await pockets.GetAsync(ct);

        int[] ids = entities.Select(pocket => pocket.Id).ToArray();
        IReadOnlyDictionary<int, decimal> balances =
            await transactions.GetBalancesByPocketIdsAsync(ids, ct);

        IReadOnlyList<PocketResponse> response = entities
            .Select(pocket =>
                pocket.ToResponse(pocket.StartingAmount + balances.GetValueOrDefault(pocket.Id)))
            .ToList();

        return Result.Ok(response);
    }
}
