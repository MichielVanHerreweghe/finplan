namespace FinPlan.Domain.Invitations;

// Invitations have no owner query filter, so every read must constrain by the acting user
// (recipient or sender) or by a specific target.
public interface IInvitationRepository
{
    Task<Invitation?> GetByIdAsync(int id, CancellationToken ct = default);

    // Pending invitations the user is part of, either direction — for the Requests inbox.
    Task<IReadOnlyList<Invitation>> GetForUserAsync(int userId, CancellationToken ct = default);

    // Dedupe guard: is there already a pending invitation of this shape?
    Task<bool> ExistsPendingAsync(
        InvitationType type, int fromUserId, int toUserId, int? targetId, CancellationToken ct = default);

    // Pending membership invitations for a group/activity, to show invitees as "pending" members.
    Task<IReadOnlyList<Invitation>> GetPendingByTargetAsync(
        InvitationType type, int targetId, CancellationToken ct = default);

    Task AddAsync(Invitation invitation, CancellationToken ct = default);
}
