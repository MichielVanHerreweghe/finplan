using FinPlan.Domain.Common;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Common;

internal sealed class OwnerConfiguration : EntityConfiguration<Owner>
{
    public override void Configure(EntityTypeBuilder<Owner> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.Kind);
    }
}
