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

        IEnumerable<Pocket> matched = entities;
        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            string term = query.Search.Trim();
            matched = matched.Where(pocket =>
                pocket.Name.Contains(term, StringComparison.OrdinalIgnoreCase)
                || (pocket.Description?.Contains(term, StringComparison.OrdinalIgnoreCase) ?? false));
        }

        List<Pocket> filtered = matched.ToList();
        int[] ids = filtered.Select(pocket => pocket.Id).ToArray();
        IReadOnlyDictionary<int, decimal> balances =
            await transactions.GetBalancesByPocketIdsAsync(ids, ct);

        IEnumerable<PocketResponse> responses = filtered
            .Select(pocket =>
                pocket.ToResponse(pocket.StartingAmount + balances.GetValueOrDefault(pocket.Id)));

        responses = query.Sort switch
        {
            PocketSort.NameDesc => responses.OrderByDescending(p => p.Name, StringComparer.OrdinalIgnoreCase),
            PocketSort.BalanceDesc => responses.OrderByDescending(p => p.Balance),
            PocketSort.BalanceAsc => responses.OrderBy(p => p.Balance),
            _ => responses.OrderBy(p => p.Name, StringComparer.OrdinalIgnoreCase),
        };

        IReadOnlyList<PocketResponse> response = responses.ToList();

        return Result.Ok(response);
    }
}
