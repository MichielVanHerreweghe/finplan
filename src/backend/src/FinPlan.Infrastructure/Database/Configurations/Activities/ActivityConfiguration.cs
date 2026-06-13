using FinPlan.Domain.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Activities;

internal sealed class ActivityConfiguration : EntityConfiguration<Activity>
{
    public override void Configure(EntityTypeBuilder<Activity> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.CreatedByUserId);

        // Members are owned by the activity: loaded through the navigation, cascade-deleted with it.
        // Field access because Members is exposed read-only over the _members backing field.
        builder.HasMany(x => x.Members)
            .WithOne()
            .HasForeignKey(member => member.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Members)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
