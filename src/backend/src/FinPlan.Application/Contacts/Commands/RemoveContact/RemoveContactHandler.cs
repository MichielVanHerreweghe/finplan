using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FluentResults;

namespace FinPlan.Application.Contacts.Commands.RemoveContact;

internal sealed class RemoveContactHandler(
    IContactRepository contacts,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<RemoveContactCommand, Result>
{
    public async Task<Result> Handle(RemoveContactCommand command, CancellationToken ct)
    {
        Contact? contact = await contacts.GetByIdAsync(command.ContactId, ct);

        // Contacts sit outside the owner query filter, so ownership is enforced here: a contact
        // is only removable by the user who owns it.
        if (contact is null || contact.OwnerUserId != currentUser.CurrentUserId)
            return Result.Fail($"Contact {command.ContactId} does not exist.");

        contacts.Remove(contact);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
