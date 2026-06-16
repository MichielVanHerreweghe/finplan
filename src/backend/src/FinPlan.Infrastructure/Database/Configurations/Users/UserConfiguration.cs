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

        // The user's personal owner, created together with the user. Restrict: the owner can't
        // be deleted while the user (or any of their data) references it.
        builder.HasIndex(x => x.OwnerId).IsUnique();
        builder.HasOne(x => x.Owner)
            .WithMany()
            .HasForeignKey(x => x.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
