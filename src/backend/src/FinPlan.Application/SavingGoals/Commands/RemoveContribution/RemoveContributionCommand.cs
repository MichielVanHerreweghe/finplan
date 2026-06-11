using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.SavingGoals.Commands.RemoveContribution;

public sealed record RemoveContributionCommand(
    int SavingGoalId,
    int ContributionId) : ICommand;
