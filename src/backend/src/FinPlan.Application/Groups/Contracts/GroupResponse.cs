using FinPlan.Domain.Groups;
using FinPlan.Domain.Users;

namespace FinPlan.Application.Groups.Contracts;

public sealed record GroupResponse(
    int Id,
    int OwnerId,
    string Name,
    string? Description,
    int CreatedByUserId,
    IReadOnlyList<GroupMemberResponse> Members);

// Pending is true for someone who was invited but hasn't accepted yet.
public sealed record GroupMemberResponse(int UserId, string? DisplayName, string? Email, bool Pending);

internal static class GroupMapping
{
    public static GroupResponse ToResponse(
        this Group group,
        IReadOnlyDictionary<int, User> usersById,
        IReadOnlyCollection<int> pendingUserIds)
    {
        IEnumerable<GroupMemberResponse> accepted = group.Members
            .Select(member =>
            {
                User? user = usersById.GetValueOrDefault(member.UserId);
                return new GroupMemberResponse(member.UserId, user?.DisplayName, user?.Email, Pending: false);
            });

        IEnumerable<GroupMemberResponse> pending = pendingUserIds
            .Select(userId =>
            {
                User? user = usersById.GetValueOrDefault(userId);
                return new GroupMemberResponse(userId, user?.DisplayName, user?.Email, Pending: true);
            });

        return new GroupResponse(
            group.Id, group.OwnerId, group.Name, group.Description, group.CreatedByUserId,
            accepted.Concat(pending).ToList());
    }
}
