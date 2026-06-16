using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Activities.Commands.DeleteActivityExpense;

public sealed record DeleteActivityExpenseCommand(int Id) : ICommand;
