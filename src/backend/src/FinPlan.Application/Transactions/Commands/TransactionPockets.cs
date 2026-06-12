using FinPlan.Domain.Pockets;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands;

// Shared guard for the create/update transaction handlers: every referenced pocket
// endpoint must exist. Which endpoints are required for the type is enforced by the domain.
internal static class TransactionPockets
{
    public static async Task<Result> EnsureExist(
        IPocketRepository pockets, int? fromPocketId, int? toPocketId, CancellationToken ct)
    {
        int[] ids = new[] { fromPocketId, toPocketId }
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToArray();

        if (ids.Length == 0)
            return Result.Ok();

        IReadOnlyList<Pocket> found = await pockets.GetByIdsAsync(ids, ct);

        return found.Count == ids.Length
            ? Result.Ok()
            : Result.Fail("One or more referenced pockets do not exist.");
    }
}
