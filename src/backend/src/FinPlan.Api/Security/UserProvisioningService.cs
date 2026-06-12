using FinPlan.Domain.Common;
using FinPlan.Domain.Users;
using FluentResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace FinPlan.Api.Security;

public interface IUserProvisioningService
{
    // Returns the internal user id for the given OIDC identity, creating the User on first sight.
    Task<int> EnsureProvisionedAsync(
        string issuer, string subject, string? email, string? displayName, CancellationToken ct);
}

internal sealed class UserProvisioningService(
    IUserRepository users,
    IUnitOfWork unitOfWork,
    IMemoryCache cache) : IUserProvisioningService
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(30);

    public async Task<int> EnsureProvisionedAsync(
        string issuer, string subject, string? email, string? displayName, CancellationToken ct)
    {
        string cacheKey = CacheKey(issuer, subject);
        if (cache.TryGetValue(cacheKey, out int cachedId))
            return cachedId;

        User? user = await users.GetByExternalIdentityAsync(issuer, subject, ct);

        if (user is null)
        {
            user = await CreateAsync(issuer, subject, email, displayName, ct);
        }
        else if (user.Email != email || user.DisplayName != displayName)
        {
            // Refresh changeable profile fields on login; the identity key never changes.
            user.UpdateProfile(email, displayName);
            await unitOfWork.SaveChangesAsync(ct);
        }

        cache.Set(cacheKey, user.Id, new MemoryCacheEntryOptions { SlidingExpiration = CacheTtl });
        return user.Id;
    }

    private async Task<User> CreateAsync(
        string issuer, string subject, string? email, string? displayName, CancellationToken ct)
    {
        FluentResults.Result<User> created = User.Create(issuer, subject, email, displayName);
        if (created.IsFailed)
            throw new InvalidOperationException(
                "Cannot provision user: " + string.Join("; ", created.Errors.Select(e => e.Message)));

        try
        {
            await users.AddAsync(created.Value, ct);
            await unitOfWork.SaveChangesAsync(ct);
            return created.Value;
        }
        catch (DbUpdateException)
        {
            // Lost a race with a concurrent first request for the same identity (unique index
            // on issuer+subject). Re-read the row the winner committed.
            User? existing = await users.GetByExternalIdentityAsync(issuer, subject, ct);
            if (existing is null)
                throw;

            return existing;
        }
    }

    private static string CacheKey(string issuer, string subject) => $"user:{issuer}|{subject}";
}
