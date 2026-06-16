using FluentValidation;

namespace FinPlan.Application.Groups.Commands.RemoveGroupMember;

public sealed class RemoveGroupMemberValidator : AbstractValidator<RemoveGroupMemberCommand>
{
    public RemoveGroupMemberValidator()
    {
        RuleFor(command => command.GroupId).GreaterThan(0);
        RuleFor(command => command.UserId).GreaterThan(0);
    }
}
