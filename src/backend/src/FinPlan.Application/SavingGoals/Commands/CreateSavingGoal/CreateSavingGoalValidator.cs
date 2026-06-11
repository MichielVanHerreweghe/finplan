using FluentValidation;

namespace FinPlan.Application.SavingGoals.Commands.CreateSavingGoal;

// Guards the request shape at the edge of the application. The domain's own
// SavingGoal.Create remains the authoritative invariant check.
public sealed class CreateSavingGoalValidator : AbstractValidator<CreateSavingGoalCommand>
{
    public CreateSavingGoalValidator()
    {
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.TargetAmount).GreaterThan(0);
    }
}
