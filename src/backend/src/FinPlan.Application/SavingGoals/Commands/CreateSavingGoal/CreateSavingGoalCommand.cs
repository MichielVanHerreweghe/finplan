using FinPlan.Application.Common.Messaging;
using FluentResults;

namespace FinPlan.Application.SavingGoals.Commands.CreateSavingGoal;

public sealed record CreateSavingGoalCommand(
    string Name,
    string? Description,
    decimal TargetAmount,
    DateOnly? Deadline,
    int PocketId) : ICommand<Result<int>>;
