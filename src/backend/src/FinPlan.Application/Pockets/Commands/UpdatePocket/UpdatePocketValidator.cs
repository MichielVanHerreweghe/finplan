using FluentValidation;

namespace FinPlan.Application.Pockets.Commands.UpdatePocket;

public sealed class UpdatePocketValidator : AbstractValidator<UpdatePocketCommand>
{
    public UpdatePocketValidator()
    {
        RuleFor(command => command.Id).GreaterThan(0);
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.ParentPocketId)
            .GreaterThan(0)
            .When(command => command.ParentPocketId.HasValue);
        RuleFor(command => command.StartingAmount).GreaterThanOrEqualTo(0);
    }
}
