using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Activities;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FinPlan.Domain.Groups;
using FinPlan.Domain.Invitations;
using FluentResults;

namespace FinPlan.Application.Invitations.Commands.AcceptInvitation;

internal sealed class AcceptInvitationHandler(
    IInvitationRepository invitations,
    IContactRepository contacts,
    IGroupRepository groups,
    IActivityRepository activities,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<AcceptInvitationCommand, Result>
{
    public async Task<Result> Handle(AcceptInvitationCommand command, CancellationToken ct)
    {
        Invitation? invitation = await invitations.GetByIdAsync(command.InvitationId, ct);

        // Only the recipient can accept, and only while still pending.
        if (invitation is null || invitation.ToUserId != currentUser.CurrentUserId)
            return Result.Fail($"Request {command.InvitationId} does not exist.");

        Result accepted = invitation.Accept();

        if (accepted.IsFailed)
            return accepted;

        Result granted = await GrantAsync(invitation, ct);

        if (granted.IsFailed)
            return granted;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }

    private async Task<Result> GrantAsync(Invitation invitation, CancellationToken ct)
    {
        switch (invitation.Type)
        {
            case InvitationType.Contact:
                // Accepting a contact request makes both people each other's contacts.
                await EnsureContactAsync(invitation.FromUserId, invitation.ToUserId, ct);
                await EnsureContactAsync(invitation.ToUserId, invitation.FromUserId, ct);
                return Result.Ok();

            case InvitationType.GroupMember:
                Group? group = await groups.GetByIdWithMembersAsync(invitation.TargetId ?? 0, ct);
                if (group is null)
                    return Result.Fail("The group no longer exists.");
                return group.AddMember(invitation.ToUserId);

            case InvitationType.ActivityMember:
                Activity? activity = await activities.GetByIdWithMembersAsync(invitation.TargetId ?? 0, ct);
                if (activity is null)
                    return Result.Fail("The activity no longer exists.");
                return activity.AddMember(invitation.ToUserId);

            default:
                return Result.Fail("Unsupported invitation type.");
        }
    }

    private async Task EnsureContactAsync(int ownerUserId, int contactUserId, CancellationToken ct)
    {
        if (await contacts.ExistsAsync(ownerUserId, contactUserId, ct))
            return;

        Result<Contact> created = Contact.Create(ownerUserId, contactUserId);

        if (created.IsSuccess)
            await contacts.AddAsync(created.Value, ct);
    }
}
