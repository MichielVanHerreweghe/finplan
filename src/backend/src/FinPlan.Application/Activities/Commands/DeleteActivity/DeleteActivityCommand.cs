using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Activities.Commands.DeleteActivity;

public sealed record DeleteActivityCommand(int Id) : ICommand;
