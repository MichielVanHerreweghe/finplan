using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Groups.Commands.RemoveGroupMember;

public sealed record RemoveGroupMemberCommand(int GroupId, int UserId) : ICommand;
