using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.SavingGoals.Commands.AddContribution;

public sealed record AddContributionCommand(
    int SavingGoalId,
    decimal Amount,
    DateOnly Date) : ICommand;
