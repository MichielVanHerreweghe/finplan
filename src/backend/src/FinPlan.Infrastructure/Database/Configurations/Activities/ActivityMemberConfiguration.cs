using FinPlan.Domain.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Activities;

internal sealed class ActivityMemberConfiguration : EntityConfiguration<ActivityMember>
{
    public override void Configure(EntityTypeBuilder<ActivityMember> builder)
    {
        base.Configure(builder);

        // A user appears at most once per activity. Filtered to live rows to match soft-delete.
        builder.HasIndex(x => new { x.ActivityId, x.UserId })
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");

        builder.HasIndex(x => x.UserId);
    }
}
