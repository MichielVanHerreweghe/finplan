using FluentValidation;

namespace FinPlan.Application.SavingGoals.Commands.UpdateSavingGoal;

public sealed class UpdateSavingGoalValidator : AbstractValidator<UpdateSavingGoalCommand>
{
    public UpdateSavingGoalValidator()
    {
        RuleFor(command => command.Id).GreaterThan(0);
        RuleFor(command => command.Name).NotEmpty();
        RuleFor(command => command.TargetAmount).GreaterThan(0);
    }
}
