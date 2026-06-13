using FluentValidation;

namespace FinPlan.Application.Groups.Commands.AddGroupMember;

public sealed class AddGroupMemberValidator : AbstractValidator<AddGroupMemberCommand>
{
    public AddGroupMemberValidator()
    {
        RuleFor(command => command.GroupId).GreaterThan(0);
        RuleFor(command => command.Email).NotEmpty().EmailAddress();
    }
}
