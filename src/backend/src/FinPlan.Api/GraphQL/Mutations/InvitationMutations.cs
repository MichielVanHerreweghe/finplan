using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Invitations.Commands.AcceptInvitation;
using FinPlan.Application.Invitations.Commands.DeclineInvitation;
using FinPlan.Application.Invitations.Commands.SendInvitation;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    // Returns the new request's id.
    [UseMutationConvention(PayloadFieldName = "invitationId")]
    public async Task<int> SendInvitation(
        SendInvitationInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new SendInvitationCommand(input.Type, input.Email, input.TargetId), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> AcceptInvitation(
        AcceptInvitationInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new AcceptInvitationCommand(input.InvitationId), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeclineInvitation(
        DeclineInvitationInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeclineInvitationCommand(input.InvitationId), ct)).Unwrap();
}
