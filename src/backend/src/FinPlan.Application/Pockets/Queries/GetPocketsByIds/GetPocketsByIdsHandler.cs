using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Pockets.Queries.GetPocketsByIds;

internal sealed class GetPocketsByIdsHandler(
    IPocketRepository pockets,
    ITransactionRepository transactions)
    : IQueryHandler<GetPocketsByIdsQuery, Result<IReadOnlyList<PocketResponse>>>
{
    public async Task<Result<IReadOnlyList<PocketResponse>>> Handle(
        GetPocketsByIdsQuery query, CancellationToken ct)
    {
        IReadOnlyList<Pocket> entities = await pockets.GetByIdsAsync(query.Ids, ct);

        IReadOnlyDictionary<int, decimal> balances =
            await transactions.GetBalancesByPocketIdsAsync(query.Ids, ct);

        IReadOnlyList<PocketResponse> response = entities
            .Select(pocket =>
                pocket.ToResponse(pocket.StartingAmount + balances.GetValueOrDefault(pocket.Id)))
            .ToList();

        return Result.Ok(response);
    }
}
