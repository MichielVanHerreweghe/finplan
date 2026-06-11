using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.SavingGoals.Commands.DeleteSavingGoal;

public sealed record DeleteSavingGoalCommand(int Id) : ICommand;
