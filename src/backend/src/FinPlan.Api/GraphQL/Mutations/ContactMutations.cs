using FinPlan.Api.GraphQL.Errors;
using FinPlan.Application.Common.Messaging;
using FinPlan.Application.Contacts.Commands.CreateContactExpense;
using FinPlan.Application.Contacts.Commands.DeleteContactExpense;
using FinPlan.Application.Contacts.Commands.DeleteContactSettlement;
using FinPlan.Application.Contacts.Commands.RecordContactSettlement;
using FinPlan.Application.Contacts.Commands.RemoveContact;
using HotChocolate;

namespace FinPlan.Api.GraphQL.Mutations;

public partial class Mutation
{
    [Error<RequestException>]
    public async Task<bool> RemoveContact(
        RemoveContactInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(new RemoveContactCommand(input.ContactId), ct)).Unwrap();

    [Error<RequestException>]
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> CreateContactExpense(
        CreateContactExpenseInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new CreateContactExpenseCommand(
                input.ContactId,
                input.Description,
                input.Date,
                input.Amount,
                input.PaidByUserId,
                input.SplitType,
                input.Splits
                    .Select(split => new ContactSplitInput(split.UserId, split.ExactAmount, split.Percentage))
                    .ToList()),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteContactExpense(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteContactExpenseCommand(id), ct)).Unwrap();

    [Error<RequestException>]
    [UseMutationConvention(PayloadFieldName = "id")]
    public async Task<int> RecordContactSettlement(
        RecordContactSettlementInput input, ISender sender, CancellationToken ct) =>
        (await sender.Send(
            new RecordContactSettlementCommand(
                input.ContactId, input.Amount, input.Date, input.FromUserId, input.ToUserId),
            ct)).Unwrap();

    [Error<RequestException>]
    public async Task<bool> DeleteContactSettlement(
        int id, ISender sender, CancellationToken ct) =>
        (await sender.Send(new DeleteContactSettlementCommand(id), ct)).Unwrap();
}
