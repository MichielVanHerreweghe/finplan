using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.SavingGoals.Commands.UpdateSavingGoal;

public sealed record UpdateSavingGoalCommand(
    int Id,
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline,
    int PocketId) : ICommand;
