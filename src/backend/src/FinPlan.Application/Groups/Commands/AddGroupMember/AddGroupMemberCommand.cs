using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Groups.Commands.AddGroupMember;

public sealed record AddGroupMemberCommand(int GroupId, string Email) : ICommand;
