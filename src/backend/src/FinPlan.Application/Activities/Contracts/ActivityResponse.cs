using FinPlan.Domain.Activities;
using FinPlan.Domain.Users;

namespace FinPlan.Application.Activities.Contracts;

public sealed record ActivityResponse(
    int Id,
    string Name,
    string? Description,
    int CreatedByUserId,
    IReadOnlyList<ActivityMemberResponse> Members,
    IReadOnlyList<ActivityBalanceResponse> Balances);

public sealed record ActivityMemberResponse(int UserId, string? DisplayName, string? Email);

// A member's net position in the activity: positive means the activity owes them, negative means
// they owe the activity. Empty on the list view; populated on the single-activity view.
public sealed record ActivityBalanceResponse(int UserId, decimal Net);

internal static class ActivityMapping
{
    public static ActivityResponse ToResponse(
        this Activity activity,
        IReadOnlyDictionary<int, User> usersById,
        IReadOnlyList<ActivityBalanceResponse> balances)
    {
        IReadOnlyList<ActivityMemberResponse> members = activity.Members
            .Select(member =>
            {
                User? user = usersById.GetValueOrDefault(member.UserId);
                return new ActivityMemberResponse(member.UserId, user?.DisplayName, user?.Email);
            })
            .ToList();

        return new ActivityResponse(
            activity.Id, activity.Name, activity.Description, activity.CreatedByUserId, members, balances);
    }
}
