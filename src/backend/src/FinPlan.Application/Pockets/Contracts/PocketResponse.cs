using FinPlan.Domain.Pockets;

namespace FinPlan.Application.Pockets.Contracts;

public sealed record PocketResponse(
    int Id,
    string Name,
    string? Description,
    int? ParentPocketId,
    decimal StartingAmount,
    decimal Balance);

internal static class PocketMapping
{
    // balance is the full balance (starting amount + net transfers), computed by the caller.
    public static PocketResponse ToResponse(this Pocket pocket, decimal balance) =>
        new(pocket.Id,
            pocket.Name,
            pocket.Description,
            pocket.ParentPocketId,
            pocket.StartingAmount,
            balance);
}
