using FluentValidation;

namespace FinPlan.Application.Pockets.Commands.CreatePocket;

// Guards the request shape at the edge of the application. The domain's own
// Pocket.Create remains the authoritative invariant check.
public sealed class CreatePocketValidator : AbstractValidator<CreatePocketCommand>
{
    public CreatePocketValidator()
    {
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.ParentPocketId)
            .GreaterThan(0)
            .When(command => command.ParentPocketId.HasValue);
        RuleFor(command => command.StartingAmount).GreaterThanOrEqualTo(0);
    }
}
