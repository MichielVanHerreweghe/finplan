using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Invitations.Contracts;
using FluentResults;

namespace FinPlan.Application.Invitations.Queries.GetMyInvitations;

// All pending requests involving the current user (incoming and outgoing) — the Requests inbox.
public sealed record GetMyInvitationsQuery : IQuery<Result<IReadOnlyList<InvitationResponse>>>;
