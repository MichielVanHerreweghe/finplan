using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Activities.Commands.AddActivityMember;
using FinPlan.Application.Activities.Commands.CreateActivity;
using FinPlan.Application.Activities.Commands.CreateActivityExpense;
using FinPlan.Application.Activities.Commands.DeleteActivity;
using FinPlan.Application.Activities.Commands.DeleteActivityExpense;
using FinPlan.Application.Activities.Commands.RemoveActivityMember;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    // Without this the mutation convention names the payload field after the return type ("int").
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreateActivity(
        CreateActivityInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new CreateActivityCommand(input.Name, input.Description), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> AddActivityMember(
        AddActivityMemberInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new AddActivityMemberCommand(input.ActivityId, input.Email), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> RemoveActivityMember(
        RemoveActivityMemberInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new RemoveActivityMemberCommand(input.ActivityId, input.UserId), ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteActivity(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteActivityCommand(id), ct)).Unwrap();

    [Error<RequestException>]
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreateActivityExpense(
        CreateActivityExpenseInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new CreateActivityExpenseCommand(
                input.ActivityId,
                input.Description,
                input.Date,
                input.Amount,
                input.PaidByUserId,
                input.SplitType,
                input.Splits
                    .Select(split => new ExpenseSplitInput(split.UserId, split.ExactAmount, split.Percentage))
                    .ToList()),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteActivityExpense(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteActivityExpenseCommand(id), ct)).Unwrap();
}
