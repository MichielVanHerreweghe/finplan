using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Invitations;
using FluentResults;

namespace FinPlan.Application.Invitations.Commands.DeclineInvitation;

internal sealed class DeclineInvitationHandler(
    IInvitationRepository invitations,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<DeclineInvitationCommand, Result>
{
    public async Task<Result> Handle(DeclineInvitationCommand command, CancellationToken ct)
    {
        Invitation? invitation = await invitations.GetByIdAsync(command.InvitationId, ct);

        if (invitation is null || invitation.ToUserId != currentUser.CurrentUserId)
            return Result.Fail($"Request {command.InvitationId} does not exist.");

        Result declined = invitation.Decline();

        if (declined.IsFailed)
            return declined;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
