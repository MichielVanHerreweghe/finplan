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

public sealed record GroupMemberResponse(int UserId, string? DisplayName, string? Email);

internal static class GroupMapping
{
    public static GroupResponse ToResponse(this Group group, IReadOnlyDictionary<int, User> usersById)
    {
        IReadOnlyList<GroupMemberResponse> members = group.Members
            .Select(member =>
            {
                User? user = usersById.GetValueOrDefault(member.UserId);
                return new GroupMemberResponse(member.UserId, user?.DisplayName, user?.Email);
            })
            .ToList();

        return new GroupResponse(
            group.Id, group.OwnerId, group.Name, group.Description, group.CreatedByUserId, members);
    }
}
