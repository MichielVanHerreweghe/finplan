using FinPlan.Domain.Activities;
using FinPlan.Domain.Users;

namespace FinPlan.Application.Activities.Contracts;

public sealed record ActivityResponse(
    int Id,
    string Name,
    string? Description,
    int CreatedByUserId,
    IReadOnlyList<ActivityMemberResponse> Members,
    IReadOnlyList<ActivityBalanceResponse> Balances,
    IReadOnlyList<ActivitySettlementResponse> Settlements);

// Pending is true for someone who was invited but hasn't accepted yet.
public sealed record ActivityMemberResponse(int UserId, string? DisplayName, string? Email, bool Pending);

// A member's net position in the activity: positive means the activity owes them, negative means
// they owe the activity. Empty on the list view; populated on the single-activity view.
public sealed record ActivityBalanceResponse(int UserId, decimal Net);

// A single transfer needed to settle up: FromUserId should pay ToUserId the given amount. The set
// is computed to keep the number of transfers minimal. Empty on the list view; populated on the
// single-activity view.
public sealed record ActivitySettlementResponse(int FromUserId, int ToUserId, decimal Amount);

internal static class ActivityMapping
{
    public static ActivityResponse ToResponse(
        this Activity activity,
        IReadOnlyDictionary<int, User> usersById,
        IReadOnlyList<ActivityBalanceResponse> balances,
        IReadOnlyList<ActivitySettlementResponse> settlements,
        IReadOnlyCollection<int> pendingUserIds)
    {
        IEnumerable<ActivityMemberResponse> accepted = activity.Members
            .Select(member =>
            {
                User? user = usersById.GetValueOrDefault(member.UserId);
                return new ActivityMemberResponse(member.UserId, user?.DisplayName, user?.Email, Pending: false);
            });

        IEnumerable<ActivityMemberResponse> pending = pendingUserIds
            .Select(userId =>
            {
                User? user = usersById.GetValueOrDefault(userId);
                return new ActivityMemberResponse(userId, user?.DisplayName, user?.Email, Pending: true);
            });

        return new ActivityResponse(
            activity.Id, activity.Name, activity.Description, activity.CreatedByUserId,
            accepted.Concat(pending).ToList(), balances, settlements);
    }
}
