using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Groups.Commands.DeleteGroup;

public sealed record DeleteGroupCommand(int GroupId) : ICommand;
