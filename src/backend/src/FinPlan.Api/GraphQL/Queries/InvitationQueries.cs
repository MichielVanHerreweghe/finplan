using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Invitations.Contracts;
using FinPlan.Application.Invitations.Queries.GetMyInvitations;

namespace FinPlan.Api.GraphQL.Queries;

public partial class Query
{
    // All pending requests involving the current user (incoming and outgoing) — the Requests inbox.
    public async Task<IReadOnlyList<InvitationResponse>> GetMyInvitations(
        ISender sender, CancellationToken ct) =>
        (await sender.Send(new GetMyInvitationsQuery(), ct)).Unwrap();
}
