using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Invitations.Commands.DeclineInvitation;

public sealed record DeclineInvitationCommand(int InvitationId) : ICommand;
