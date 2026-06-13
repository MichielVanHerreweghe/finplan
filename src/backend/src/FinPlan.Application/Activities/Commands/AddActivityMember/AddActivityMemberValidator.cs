using FluentValidation;

namespace FinPlan.Application.Activities.Commands.AddActivityMember;

public sealed class AddActivityMemberValidator : AbstractValidator<AddActivityMemberCommand>
{
    public AddActivityMemberValidator()
    {
        RuleFor(command => command.ActivityId).GreaterThan(0);
        RuleFor(command => command.Email).NotEmpty().EmailAddress();
    }
}
