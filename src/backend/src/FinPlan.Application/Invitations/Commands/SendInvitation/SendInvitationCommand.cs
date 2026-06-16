using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Invitations;
using FluentResults;

namespace FinPlan.Application.Invitations.Commands.SendInvitation;

// Sends a request to another user (by email). Replaces the old direct add-member/add-contact
// commands. TargetId is the group/activity id for membership requests; null for contact requests.
// Returns the new invitation's id.
public sealed record SendInvitationCommand(
    InvitationType Type, string Email, int? TargetId) : ICommand<Result<int>>;
