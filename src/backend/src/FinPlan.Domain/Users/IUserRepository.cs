using FinPlan.Domain.Common;

namespace FinPlan.Domain.Users;

public interface IUserRepository : IRepository<User>
{
    // Lookup by the stable OIDC identity used during just-in-time provisioning.
    Task<User?> GetByExternalIdentityAsync(
        string issuer, string externalSubject, CancellationToken ct = default);

    // Find a user by email (case-insensitive) so they can be added to a group by address.
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);

    // Batch fetch for resolving group member display names from their ids.
    Task<IReadOnlyList<User>> GetByIdsAsync(
        IReadOnlyCollection<int> ids, CancellationToken ct = default);
}
