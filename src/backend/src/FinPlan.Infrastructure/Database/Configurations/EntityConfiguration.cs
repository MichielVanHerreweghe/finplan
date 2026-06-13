using FinPlan.Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations;

internal abstract class EntityConfiguration<T> : IEntityTypeConfiguration<T> where T : Entity
{
    public virtual void Configure(EntityTypeBuilder<T> builder)
    {
        builder.ToTable(typeof(T).Name);

        builder.Ignore(x => x.IsDeleted);

        builder.HasQueryFilter(x => x.DeletedAt == null);

        builder.Property(x => x.UpdatedAt)
            .IsConcurrencyToken();

        // Every owned aggregate's OwnerId references the shared Owner anchor. Configured here
        // (navigationless) so it applies uniformly to all current and future owned entities,
        // mirroring how the owner query filter is applied centrally. Restrict: an owner with
        // data cannot be deleted at the DB level.
        if (typeof(IOwnedEntity).IsAssignableFrom(typeof(T)))
        {
            builder.HasOne(typeof(Owner))
                .WithMany()
                .HasForeignKey(nameof(IOwnedEntity.OwnerId))
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}