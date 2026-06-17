using FinPlan.Domain.Common;

namespace FinPlan.Infrastructure;

// Owner context for background work: there is no HttpContext, so the worker sets the acting
// owner explicitly for the duration of a per-owner scope. Backed by a static AsyncLocal so the
// scoped ApplicationDbContext (and any child scope) reads the same id within the async flow,
// mirroring why HttpCurrentOwnerProvider reads through IHttpContextAccessor. Returns 0 when no
// owner is set, matching the "no owner -> owned reads see nothing" contract.
public sealed class AmbientCurrentOwnerProvider : ICurrentOwnerProvider
{
    private static readonly AsyncLocal<int> Current = new();

    public int CurrentOwnerId => Current.Value;

    // Sets the acting owner until the returned handle is disposed, restoring the previous value.
    public IDisposable Use(int ownerId)
    {
        if (ownerId <= 0)
            throw new ArgumentOutOfRangeException(nameof(ownerId), "Owner id must be positive.");

        int previous = Current.Value;
        Current.Value = ownerId;
        return new Reset(previous);
    }

    private sealed class Reset(int previous) : IDisposable
    {
        public void Dispose() => Current.Value = previous;
    }
}
