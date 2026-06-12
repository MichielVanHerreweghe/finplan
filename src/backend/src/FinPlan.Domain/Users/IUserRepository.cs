using FinPlan.Domain.Common;

namespace FinPlan.Domain.Users;

public interface IUserRepository : IRepository<User>
{
    // Lookup by the stable OIDC identity used during just-in-time provisioning.
    Task<User?> GetByExternalIdentityAsync(
        string issuer, string externalSubject, CancellationToken ct = default);
}
