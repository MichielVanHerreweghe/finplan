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
    }
}