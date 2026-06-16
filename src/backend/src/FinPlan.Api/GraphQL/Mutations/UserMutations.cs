using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Users.Commands.CompleteProfile;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    public async Task<bool> CompleteProfile(
        CompleteProfileInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new CompleteProfileCommand(input.FirstName, input.LastName), ct)).Unwrap();
}
