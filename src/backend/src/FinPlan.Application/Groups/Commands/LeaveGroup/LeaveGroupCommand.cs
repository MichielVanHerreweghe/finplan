using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Groups.Commands.LeaveGroup;

public sealed record LeaveGroupCommand(int GroupId) : ICommand;
