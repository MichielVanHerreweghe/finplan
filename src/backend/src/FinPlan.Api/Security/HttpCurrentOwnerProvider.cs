using FinPlan.Domain.Common;

namespace FinPlan.Api.Security;

// Resolves the owner the DbContext query filter scopes by: the effective active owner (personal
// or a group the user belongs to) that ActiveContextMiddleware stashed in HttpContext.Items.
// Reading via IHttpContextAccessor (AsyncLocal) means DataLoader child scopes see the same id as
// the request scope. Returns 0 when there is no authenticated/provisioned/resolved owner, so
// owned reads return nothing.
internal sealed class HttpCurrentOwnerProvider(IHttpContextAccessor accessor) : ICurrentOwnerProvider
{
    public int CurrentOwnerId =>
        accessor.HttpContext?.Items.TryGetValue(CurrentUser.ActiveOwnerIdItemKey, out object? value) == true
            && value is int id
                ? id
                : 0;
}
