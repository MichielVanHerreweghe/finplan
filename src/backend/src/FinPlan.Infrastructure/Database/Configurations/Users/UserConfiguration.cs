using FinPlan.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Users;

internal sealed class UserConfiguration : EntityConfiguration<User>
{
    public override void Configure(EntityTypeBuilder<User> builder)
    {
        base.Configure(builder);

        // The OIDC issuer + subject is the stable identity just-in-time provisioning keys on.
        builder.HasIndex(x => new { x.Issuer, x.ExternalSubject })
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");
    }
}
