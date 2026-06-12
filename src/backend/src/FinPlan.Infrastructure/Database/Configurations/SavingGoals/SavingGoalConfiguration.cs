using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.SavingGoals;

internal sealed class SavingGoalConfiguration : EntityConfiguration<SavingGoal>
{
    public override void Configure(EntityTypeBuilder<SavingGoal> builder)
    {
        base.Configure(builder);

        // A pocket can back any number of goals; index (non-unique) for FK lookups.
        builder.HasIndex(x => x.PocketId);

        builder.HasOne<Pocket>()
            .WithMany()
            .HasForeignKey(x => x.PocketId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
