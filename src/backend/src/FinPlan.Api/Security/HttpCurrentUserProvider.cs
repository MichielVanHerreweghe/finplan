using FinPlan.Domain.Common;

namespace FinPlan.Api.Security;

// Exposes the acting user id (the authenticated principal), independent of the active owner
// context. Reads the slot JitProvisioningMiddleware stashed; via IHttpContextAccessor so
// DataLoader child scopes see the same value. Returns 0 when unauthenticated/unprovisioned.
internal sealed class HttpCurrentUserProvider(IHttpContextAccessor accessor) : ICurrentUserProvider
{
    public int CurrentUserId =>
        accessor.HttpContext?.Items.TryGetValue(CurrentUser.UserIdItemKey, out object? value) == true
            && value is int id
                ? id
                : 0;
}
