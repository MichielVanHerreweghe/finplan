using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Pockets.Contracts;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Pockets.Queries.GetPocketById;

internal sealed class GetPocketByIdHandler(
    IPocketRepository pockets,
    ITransactionRepository transactions)
    : IQueryHandler<GetPocketByIdQuery, Result<PocketResponse>>
{
    public async Task<Result<PocketResponse>> Handle(GetPocketByIdQuery query, CancellationToken ct)
    {
        Pocket? pocket = await pockets.GetByIdAsync(query.Id, ct);

        if (pocket is null)
            return Result.Fail($"Pocket {query.Id} does not exist.");

        IReadOnlyDictionary<int, decimal> balances =
            await transactions.GetBalancesByPocketIdsAsync([query.Id], ct);

        return Result.Ok(
            pocket.ToResponse(pocket.StartingAmount + balances.GetValueOrDefault(query.Id)));
    }
}
