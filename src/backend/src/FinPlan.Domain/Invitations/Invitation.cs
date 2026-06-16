using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Invitations;

// A pending request from one user to another that, once accepted, grants a contact link or
// membership. The single backing model for the unified Requests inbox across contacts, groups and
// activities. NOT an OwnedEntity: visibility is scoped by sender/recipient, not the active owner.
public sealed class Invitation : Entity, IAggregateRoot
{
    public InvitationType Type { get; private set; }
    public int FromUserId { get; private set; }
    public int ToUserId { get; private set; }

    // The group or activity id for membership invitations; null for contact invitations.
    public int? TargetId { get; private set; }

    public InvitationStatus Status { get; private set; }

    private Invitation(InvitationType type, int fromUserId, int toUserId, int? targetId)
    {
        Type = type;
        FromUserId = fromUserId;
        ToUserId = toUserId;
        TargetId = targetId;
        Status = InvitationStatus.Pending;
    }

    public static Result<Invitation> Create(InvitationType type, int fromUserId, int toUserId, int? targetId)
    {
        Result validationResult = Validate(type, fromUserId, toUserId, targetId);

        if (validationResult.IsFailed)
            return validationResult;

        return new Invitation(type, fromUserId, toUserId, targetId);
    }

    public Result Accept()
    {
        if (Status != InvitationStatus.Pending)
            return Result.Fail("This request is no longer pending.");

        Status = InvitationStatus.Accepted;
        return Result.Ok();
    }

    public Result Decline()
    {
        if (Status != InvitationStatus.Pending)
            return Result.Fail("This request is no longer pending.");

        Status = InvitationStatus.Declined;
        return Result.Ok();
    }

    private static Result Validate(InvitationType type, int fromUserId, int toUserId, int? targetId)
    {
        Result result = new();

        if (type == InvitationType.Undefined)
            result.WithError("Invitation type cannot be undefined.");

        if (fromUserId <= 0 || toUserId <= 0)
            result.WithError("Invalid user id.");

        if (fromUserId == toUserId)
            result.WithError("You cannot send a request to yourself.");

        // Contact invitations have no target; membership invitations require one.
        if (type == InvitationType.Contact && targetId is not null)
            result.WithError("A contact request cannot have a target.");

        if (type is InvitationType.GroupMember or InvitationType.ActivityMember && targetId is null or <= 0)
            result.WithError("A membership request needs a target.");

        return result;
    }
}
