using FluentValidation;

namespace FinPlan.Application.Activities.Commands.RemoveActivityMember;

public sealed class RemoveActivityMemberValidator : AbstractValidator<RemoveActivityMemberCommand>
{
    public RemoveActivityMemberValidator()
    {
        RuleFor(command => command.ActivityId).GreaterThan(0);
        RuleFor(command => command.UserId).GreaterThan(0);
    }
}
