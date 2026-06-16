using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Activities;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FinPlan.Domain.Groups;
using FinPlan.Domain.Invitations;
using FinPlan.Domain.Users;
using FluentResults;

namespace FinPlan.Application.Invitations.Commands.SendInvitation;

internal sealed class SendInvitationHandler(
    IInvitationRepository invitations,
    IUserRepository users,
    IContactRepository contacts,
    IGroupRepository groups,
    IActivityRepository activities,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<SendInvitationCommand, Result<int>>
{
    public async Task<Result<int>> Handle(SendInvitationCommand command, CancellationToken ct)
    {
        int fromUserId = currentUser.CurrentUserId;

        User? toUser = await users.GetByEmailAsync(command.Email, ct);

        if (toUser is null)
            return Result.Fail<int>(
                $"No FinPlan user found with email '{command.Email}'. They need to sign in at least once first.");

        if (toUser.Id == fromUserId)
            return Result.Fail<int>("You cannot send a request to yourself.");

        // Type-specific authorization + "already there" guards.
        Result eligibility = await CheckEligibilityAsync(command.Type, command.TargetId, fromUserId, toUser.Id, ct);

        if (eligibility.IsFailed)
            return eligibility.ToResult<int>();

        if (await invitations.ExistsPendingAsync(command.Type, fromUserId, toUser.Id, command.TargetId, ct))
            return Result.Fail<int>("You've already sent this person a request.");

        Result<Invitation> created = Invitation.Create(command.Type, fromUserId, toUser.Id, command.TargetId);

        if (created.IsFailed)
            return created.ToResult<int>();

        await invitations.AddAsync(created.Value, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(created.Value.Id);
    }

    private async Task<Result> CheckEligibilityAsync(
        InvitationType type, int? targetId, int fromUserId, int toUserId, CancellationToken ct)
    {
        switch (type)
        {
            case InvitationType.Contact:
                if (await contacts.ExistsAsync(fromUserId, toUserId, ct))
                    return Result.Fail("This person is already in your contacts.");
                return Result.Ok();

            case InvitationType.GroupMember:
                // GetByIdForUserAsync also authorizes: the sender must be a member of the group.
                Group? group = await groups.GetByIdForUserAsync(targetId ?? 0, fromUserId, ct);
                if (group is null)
                    return Result.Fail($"Group {targetId} does not exist.");
                if (group.HasMember(toUserId))
                    return Result.Fail("This person is already a member of the group.");
                return Result.Ok();

            case InvitationType.ActivityMember:
                Activity? activity = await activities.GetByIdForUserAsync(targetId ?? 0, fromUserId, ct);
                if (activity is null)
                    return Result.Fail($"Activity {targetId} does not exist.");
                if (activity.HasMember(toUserId))
                    return Result.Fail("This person is already a member of the activity.");
                return Result.Ok();

            default:
                return Result.Fail("Unsupported invitation type.");
        }
    }
}
