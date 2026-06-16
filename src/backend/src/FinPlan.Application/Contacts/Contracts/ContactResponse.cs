using FinPlan.Domain.Contacts;
using FinPlan.Domain.Users;

namespace FinPlan.Application.Contacts.Contracts;

// Net is the current user's one-on-one balance with this contact: positive => they owe you;
// negative => you owe them; zero => settled up.
public sealed record ContactResponse(
    int Id, int UserId, string? DisplayName, string? FirstName, string? LastName, string? Email, decimal Net);

internal static class ContactMapping
{
    public static ContactResponse ToResponse(
        this Contact contact, IReadOnlyDictionary<int, User> usersById, decimal net)
    {
        User? user = usersById.GetValueOrDefault(contact.ContactUserId);
        return new ContactResponse(
            contact.Id, contact.ContactUserId,
            user?.DisplayName, user?.FirstName, user?.LastName, user?.Email, net);
    }
}
