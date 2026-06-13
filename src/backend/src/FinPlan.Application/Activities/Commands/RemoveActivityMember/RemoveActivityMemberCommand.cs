using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Activities.Commands.RemoveActivityMember;

public sealed record RemoveActivityMemberCommand(int ActivityId, int UserId) : ICommand;
