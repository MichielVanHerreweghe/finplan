using FinPlan.Domain.Invitations;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class InvitationRepository : IInvitationRepository
{
    private readonly DbSet<Invitation> _set;

    public InvitationRepository(ApplicationDbContext context)
    {
        _set = context.Set<Invitation>();
    }

    public Task<Invitation?> GetByIdAsync(int id, CancellationToken ct = default) =>
        _set.FirstOrDefaultAsync(invitation => invitation.Id == id, ct);

    public async Task<IReadOnlyList<Invitation>> GetForUserAsync(int userId, CancellationToken ct = default) =>
        await _set
            .Where(invitation =>
                invitation.Status == InvitationStatus.Pending &&
                (invitation.ToUserId == userId || invitation.FromUserId == userId))
            .OrderByDescending(invitation => invitation.Id)
            .ToListAsync(ct);

    public Task<bool> ExistsPendingAsync(
        InvitationType type, int fromUserId, int toUserId, int? targetId, CancellationToken ct = default) =>
        _set.AnyAsync(
            invitation =>
                invitation.Status == InvitationStatus.Pending &&
                invitation.Type == type &&
                invitation.FromUserId == fromUserId &&
                invitation.ToUserId == toUserId &&
                invitation.TargetId == targetId,
            ct);

    public async Task<IReadOnlyList<Invitation>> GetPendingByTargetAsync(
        InvitationType type, int targetId, CancellationToken ct = default) =>
        await _set
            .Where(invitation =>
                invitation.Status == InvitationStatus.Pending &&
                invitation.Type == type &&
                invitation.TargetId == targetId)
            .ToListAsync(ct);

    public async Task AddAsync(Invitation invitation, CancellationToken ct = default) =>
        await _set.AddAsync(invitation, ct);
}
