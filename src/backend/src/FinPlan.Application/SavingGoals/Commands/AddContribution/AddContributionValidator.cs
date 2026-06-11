using FluentValidation;

namespace FinPlan.Application.SavingGoals.Commands.AddContribution;

public sealed class AddContributionValidator : AbstractValidator<AddContributionCommand>
{
    public AddContributionValidator()
    {
        RuleFor(command => command.SavingGoalId).GreaterThan(0);
        RuleFor(command => command.Amount).GreaterThan(0);
    }
}
