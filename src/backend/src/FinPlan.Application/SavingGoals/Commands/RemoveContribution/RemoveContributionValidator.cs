using FluentValidation;

namespace FinPlan.Application.SavingGoals.Commands.RemoveContribution;

public sealed class RemoveContributionValidator : AbstractValidator<RemoveContributionCommand>
{
    public RemoveContributionValidator()
    {
        RuleFor(command => command.SavingGoalId).GreaterThan(0);
        RuleFor(command => command.ContributionId).GreaterThan(0);
    }
}
