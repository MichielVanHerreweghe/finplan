using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.SavingGoals.Commands.AddContribution;
using FinPlan.Application.SavingGoals.Commands.CreateSavingGoal;
using FinPlan.Application.SavingGoals.Commands.DeleteSavingGoal;
using FinPlan.Application.SavingGoals.Commands.RemoveContribution;
using FinPlan.Application.SavingGoals.Commands.UpdateSavingGoal;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    // Without this the mutation convention names the payload field after the return type ("int").
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreateSavingGoal(
        CreateSavingGoalInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new CreateSavingGoalCommand(input.Name, input.Description, input.TargetAmount, input.Deadline),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> UpdateSavingGoal(
        UpdateSavingGoalInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new UpdateSavingGoalCommand(input.Id, input.Name, input.Description, input.TargetAmount, input.Deadline),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteSavingGoal(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteSavingGoalCommand(id), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> AddContribution(
        AddContributionInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new AddContributionCommand(input.SavingGoalId, input.Amount, input.Date),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> RemoveContribution(
        RemoveContributionInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new RemoveContributionCommand(input.SavingGoalId, input.ContributionId),
            ct)).Unwrap();
}
