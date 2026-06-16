using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FluentResults;

namespace FinPlan.Application.Contacts.Commands.RecordContactSettlement;

internal sealed class RecordContactSettlementHandler(
    IContactRepository contacts,
    IContactLedgerRepository ledger,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<RecordContactSettlementCommand, Result<int>>
{
    public async Task<Result<int>> Handle(RecordContactSettlementCommand command, CancellationToken ct)
    {
        Contact? contact = await contacts.GetByIdAsync(command.ContactId, ct);

        if (contact is null || contact.OwnerUserId != currentUser.CurrentUserId)
            return Result.Fail<int>($"Contact {command.ContactId} does not exist.");

        int currentUserId = currentUser.CurrentUserId;
        int otherUserId = contact.ContactUserId;

        Result<ContactSettlement> created = ContactSettlement.Create(
            currentUserId, otherUserId, command.FromUserId, command.ToUserId, command.Amount, command.Date);

        if (created.IsFailed)
            return created.ToResult<int>();

        await ledger.AddSettlementAsync(created.Value, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(created.Value.Id);
    }
}
