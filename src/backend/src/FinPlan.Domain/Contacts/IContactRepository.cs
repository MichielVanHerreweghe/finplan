using FinPlan.Domain.Common;

namespace FinPlan.Domain.Contacts;

public interface IContactRepository : IRepository<Contact>
{
    // Contacts have no owner query filter, so OwnerUserId is the only thing scoping visibility.
    // Every read here MUST constrain by it or it would leak other users' contacts.
    Task<IReadOnlyList<Contact>> GetForUserAsync(int userId, CancellationToken ct = default);

    // Dedupe guard: has this user already added that contact?
    Task<bool> ExistsAsync(int ownerUserId, int contactUserId, CancellationToken ct = default);
}
