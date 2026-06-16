using FinPlan.Domain.Invitations;

namespace FinPlan.Application.Invitations.Contracts;

// Whether the current user received the request (Incoming — they can accept/decline) or sent it
// (Outgoing — read-only, awaiting the other person).
public enum InvitationDirection
{
    Incoming = 0,
    Outgoing = 1,
}

// A pending request as seen by the current user. "Other" is the counterpart: the sender for an
// incoming request, the recipient for an outgoing one. TargetName is the group/activity name.
public sealed record InvitationResponse(
    int Id,
    InvitationType Type,
    InvitationDirection Direction,
    int OtherUserId,
    string? OtherDisplayName,
    string? OtherEmail,
    int? TargetId,
    string? TargetName,
    DateTime CreatedAt);
