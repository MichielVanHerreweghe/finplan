using FluentValidation;

namespace FinPlan.Application.Activities.Commands.CreateActivity;

public sealed class CreateActivityValidator : AbstractValidator<CreateActivityCommand>
{
    public CreateActivityValidator()
    {
        RuleFor(command => command.Name).NotEmpty();
    }
}
