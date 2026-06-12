using FinPlan.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace FinPlan.Infrastructure.Database;

// Used only by the EF tooling (`dotnet ef migrations add`). The ApplicationDbContext ctor
// now requires an ICurrentOwnerProvider, which has no meaning at design time, so we supply
// a no-op one. No queries run during migration scaffolding, so owner 0 is harmless.
internal sealed class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        DbContextOptions<ApplicationDbContext> options =
            new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseNpgsql("Host=localhost;Port=5432;Database=finplan;Username=postgres;Password=postgres")
                .Options;

        return new ApplicationDbContext(options, new NoOpOwnerProvider());
    }

    private sealed class NoOpOwnerProvider : ICurrentOwnerProvider
    {
        public int CurrentOwnerId => 0;
    }
}
