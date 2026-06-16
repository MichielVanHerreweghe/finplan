using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FinPlan.Domain.Splitting;
using FluentResults;

namespace FinPlan.Application.Contacts.Commands.CreateContactExpense;

internal sealed class CreateContactExpenseHandler(
    IContactRepository contacts,
    IContactLedgerRepository ledger,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateContactExpenseCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateContactExpenseCommand command, CancellationToken ct)
    {
        Contact? contact = await contacts.GetByIdAsync(command.ContactId, ct);

        if (contact is null || contact.OwnerUserId != currentUser.CurrentUserId)
            return Result.Fail<int>($"Contact {command.ContactId} does not exist.");

        int currentUserId = currentUser.CurrentUserId;
        int otherUserId = contact.ContactUserId;

        IReadOnlyList<SplitParticipant> participants = command.Splits
            .Select(split => new SplitParticipant(split.UserId, split.ExactAmount, split.Percentage))
            .ToList();

        Result<ContactExpense> created = ContactExpense.Create(
            currentUserId,
            otherUserId,
            command.Description,
            command.Date,
            command.Amount,
            command.PaidByUserId,
            command.SplitType,
            participants);

        if (created.IsFailed)
            return created.ToResult<int>();

        await ledger.AddExpenseAsync(created.Value, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(created.Value.Id);
    }
}
