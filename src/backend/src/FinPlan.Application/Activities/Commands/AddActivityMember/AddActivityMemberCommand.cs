using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Activities.Commands.AddActivityMember;

public sealed record AddActivityMemberCommand(int ActivityId, string Email) : ICommand;
