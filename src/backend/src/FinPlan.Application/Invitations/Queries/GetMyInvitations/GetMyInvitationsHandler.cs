using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Invitations.Contracts;
using FinPlan.Domain.Activities;
using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using FinPlan.Domain.Invitations;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Invitations.Queries.GetMyInvitations;

internal sealed class GetMyInvitationsHandler(
    IInvitationRepository invitations,
    IUserRepository users,
    IGroupRepository groups,
    IActivityRepository activities,
    ICurrentUserProvider currentUser)
    : IQueryHandler<GetMyInvitationsQuery, Result<IReadOnlyList<InvitationResponse>>>
{
    public async Task<Result<IReadOnlyList<InvitationResponse>>> Handle(
        GetMyInvitationsQuery query, CancellationToken ct)
    {
        int currentUserId = currentUser.CurrentUserId;
        IReadOnlyList<Invitation> pending = await invitations.GetForUserAsync(currentUserId, ct);

        // Resolve the counterpart user for each request (sender if incoming, recipient if outgoing).
        int[] otherUserIds = pending
            .Select(invitation =>
                invitation.FromUserId == currentUserId ? invitation.ToUserId : invitation.FromUserId)
            .Distinct()
            .ToArray();
        IReadOnlyDictionary<int, User> usersById =
            (await users.GetByIdsAsync(otherUserIds, ct)).ToDictionary(user => user.Id);

        Dictionary<int, string> targetNames = await ResolveTargetNamesAsync(pending, ct);

        List<InvitationResponse> result = [];
        foreach (Invitation invitation in pending)
        {
            bool incoming = invitation.ToUserId == currentUserId;
            int otherUserId = incoming ? invitation.FromUserId : invitation.ToUserId;
            User? other = usersById.GetValueOrDefault(otherUserId);

            result.Add(new InvitationResponse(
                invitation.Id,
                invitation.Type,
                incoming ? InvitationDirection.Incoming : InvitationDirection.Outgoing,
                otherUserId,
                other?.DisplayName,
                other?.Email,
                invitation.TargetId,
                invitation.TargetId is { } targetId ? targetNames.GetValueOrDefault(targetId) : null,
                invitation.CreatedAt));
        }

        return Result.Ok<IReadOnlyList<InvitationResponse>>(result);
    }

    private async Task<Dictionary<int, string>> ResolveTargetNamesAsync(
        IReadOnlyList<Invitation> pending, CancellationToken ct)
    {
        Dictionary<int, string> names = [];

        foreach (int groupId in pending
                     .Where(invitation => invitation.Type == InvitationType.GroupMember && invitation.TargetId is not null)
                     .Select(invitation => invitation.TargetId!.Value)
                     .Distinct())
        {
            Group? group = await groups.GetByIdWithMembersAsync(groupId, ct);
            if (group is not null)
                names[groupId] = group.Name;
        }

        foreach (int activityId in pending
                     .Where(invitation => invitation.Type == InvitationType.ActivityMember && invitation.TargetId is not null)
                     .Select(invitation => invitation.TargetId!.Value)
                     .Distinct())
        {
            Activity? activity = await activities.GetByIdWithMembersAsync(activityId, ct);
            if (activity is not null)
                names[activityId] = activity.Name;
        }

        return names;
    }
}
