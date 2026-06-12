using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Pockets.Commands.DeletePocket;

public sealed record DeletePocketCommand(int Id) : ICommand;
