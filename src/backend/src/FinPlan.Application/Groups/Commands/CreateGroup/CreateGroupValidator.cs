using FluentValidation;

namespace FinPlan.Application.Groups.Commands.CreateGroup;

public sealed class CreateGroupValidator : AbstractValidator<CreateGroupCommand>
{
    public CreateGroupValidator()
    {
        RuleFor(command => command.Name).NotEmpty();
    }
}
