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
}
