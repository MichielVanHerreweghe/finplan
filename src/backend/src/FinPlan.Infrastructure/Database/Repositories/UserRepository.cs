using FinPlan.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace FinPlan.Infrastructure.Database.Repositories;

internal sealed class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public Task<User?> GetByExternalIdentityAsync(
        string issuer, string externalSubject, CancellationToken ct = default) =>
        Set.FirstOrDefaultAsync(
            user => user.Issuer == issuer && user.ExternalSubject == externalSubject, ct);

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default) =>
        Set.FirstOrDefaultAsync(
            user => user.Email != null && user.Email.ToLower() == email.ToLower(), ct);

    public async Task<IReadOnlyList<User>> GetByIdsAsync(
        IReadOnlyCollection<int> ids, CancellationToken ct = default) =>
        await Set.Where(user => ids.Contains(user.Id)).ToListAsync(ct);
}
