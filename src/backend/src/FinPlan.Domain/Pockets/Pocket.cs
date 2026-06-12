using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Pockets;

public sealed class Pocket : OwnedEntity, IAggregateRoot
{
    public string Name { get; private set; }
    public string? Description { get; private set; }

    // Self-reference for one-level organizational nesting. null means top-level.
    // The balance never rolls up: money carved into a child is a real transfer out
    // of the parent, so the parent's balance already reflects it.
    public int? ParentPocketId { get; private set; }

    // Opening balance: money already in the pocket when it was created, NOT a transaction.
    // The full balance is this plus the net of transfers in and out (computed read-side).
    public decimal StartingAmount { get; private set; }

    private Pocket(string name, string? description, int? parentPocketId, decimal startingAmount)
    {
        Name = name;
        Description = description;
        ParentPocketId = parentPocketId;
        StartingAmount = startingAmount;
    }

    public static Result<Pocket> Create(string name, string? description, int? parentPocketId, decimal startingAmount)
    {
        Result validationResult = Validate(name, parentPocketId, startingAmount);

        if (validationResult.IsFailed)
            return validationResult;

        return new Pocket(name, description, parentPocketId, startingAmount);
    }

    public Result Update(string name, string? description, int? parentPocketId, decimal startingAmount)
    {
        Result validationResult = Validate(name, parentPocketId, startingAmount);

        if (validationResult.IsFailed)
            return validationResult;

        Name = name;
        Description = description;
        ParentPocketId = parentPocketId;
        StartingAmount = startingAmount;

        return Result.Ok();
    }

    private static Result Validate(string name, int? parentPocketId, decimal startingAmount)
    {
        Result result = new();

        if (string.IsNullOrWhiteSpace(name))
            result.WithError("Name cannot be empty.");

        // null means "top-level" and is allowed; a supplied id must be positive.
        // Existence, no-self-parent and depth-1 rules are cross-aggregate and live in the handler.
        if (parentPocketId is <= 0)
            result.WithError("Invalid parent pocket id.");

        if (startingAmount < 0)
            result.WithError("Starting amount cannot be negative.");

        return result;
    }
}
