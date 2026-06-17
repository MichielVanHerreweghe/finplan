using FinPlan.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace FinPlan.Api.Health;

/// <summary>
/// Readiness probe dependency: reports healthy only when the API can reach PostgreSQL.
/// Tagged "ready" so it backs <c>/health/ready</c> while <c>/health/live</c> stays a pure
/// liveness check (process is up). Kept dependency-free (no extra NuGet) by querying the
/// existing <see cref="ApplicationDbContext"/> connection directly.
/// </summary>
internal sealed class DatabaseHealthCheck(ApplicationDbContext dbContext) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        bool canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);

        return canConnect
            ? HealthCheckResult.Healthy()
            : HealthCheckResult.Unhealthy("Cannot connect to the database.");
    }
}
