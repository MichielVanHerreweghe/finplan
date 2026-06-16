using FinPlan.Domain.Common;
using FluentResults;

namespace FinPlan.Domain.Contacts;

// A user's personal address-book entry pointing at another FinPlan user. Used to quick-add people
// as activity/group members without retyping their email. NOT an IOwnedEntity: contacts belong to
// the user themselves and must stay visible regardless of the active owner context (personal vs
// group), so they sit outside the owner query filter and are scoped by OwnerUserId instead —
// mirroring how Group/GroupMember are scoped by membership.
public sealed class Contact : Entity, IAggregateRoot
{
    // The user who owns this contact entry.
    public int OwnerUserId { get; private set; }

    // The FinPlan user this entry points at.
    public int ContactUserId { get; private set; }

    private Contact(int ownerUserId, int contactUserId)
    {
        OwnerUserId = ownerUserId;
        ContactUserId = contactUserId;
    }

    public static Result<Contact> Create(int ownerUserId, int contactUserId)
    {
        Result validationResult = Validate(ownerUserId, contactUserId);

        if (validationResult.IsFailed)
            return validationResult;

        return new Contact(ownerUserId, contactUserId);
    }

    private static Result Validate(int ownerUserId, int contactUserId)
    {
        Result result = new();

        if (ownerUserId <= 0)
            result.WithError("Invalid owner id.");

        if (contactUserId <= 0)
            result.WithError("Invalid contact id.");

        if (ownerUserId == contactUserId)
            result.WithError("You cannot add yourself as a contact.");

        return result;
    }
}
