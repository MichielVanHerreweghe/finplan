using FinPlan.Domain.Invitations;
using FluentValidation;

namespace FinPlan.Application.Invitations.Commands.SendInvitation;

public sealed class SendInvitationValidator : AbstractValidator<SendInvitationCommand>
{
    public SendInvitationValidator()
    {
        RuleFor(command => command.Type).NotEqual(InvitationType.Undefined);
        RuleFor(command => command.Email).NotEmpty().EmailAddress();
    }
}
