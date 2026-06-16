using FinPlan.Domain.Contacts;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class ContactRepository : Repository<Contact>, IContactRepository
{
    public ContactRepository(ApplicationDbContext context) : base(context)
    {
    }

    // Contacts have no owner query filter, so OwnerUserId is the only thing scoping visibility.
    public async Task<IReadOnlyList<Contact>> GetForUserAsync(int userId, CancellationToken ct = default) =>
        await Set
            .Where(contact => contact.OwnerUserId == userId)
            .OrderByDescending(contact => contact.Id)
            .ToListAsync(ct);

    public Task<bool> ExistsAsync(int ownerUserId, int contactUserId, CancellationToken ct = default) =>
        Set.AnyAsync(
            contact => contact.OwnerUserId == ownerUserId && contact.ContactUserId == contactUserId, ct);
}
