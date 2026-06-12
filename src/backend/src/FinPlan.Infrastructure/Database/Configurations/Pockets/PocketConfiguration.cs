using FinPlan.Domain.Pockets;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Pockets;

internal sealed class PocketConfiguration : EntityConfiguration<Pocket>
{
    public override void Configure(EntityTypeBuilder<Pocket> builder)
    {
        base.Configure(builder);

        // One-level organizational nesting. Restrict: a parent with children cannot be
        // deleted at the DB level (the application also blocks it with a clear error).
        builder.HasOne<Pocket>()
            .WithMany()
            .HasForeignKey(x => x.ParentPocketId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.ParentPocketId);
    }
}
