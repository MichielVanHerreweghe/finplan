using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Invitations.Commands.AcceptInvitation;

public sealed record AcceptInvitationCommand(int InvitationId) : ICommand;
