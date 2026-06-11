using FinPlan.Domain.SavingGoals;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.SavingGoals;

internal sealed class SavingGoalConfiguration : EntityConfiguration<SavingGoal>
{
    public override void Configure(EntityTypeBuilder<SavingGoal> builder)
    {
        base.Configure(builder);

        // Computed from the contributions collection; never stored.
        builder.Ignore(x => x.SavedAmount);
        builder.Ignore(x => x.RemainingAmount);
        builder.Ignore(x => x.IsCompleted);

        builder.HasMany(x => x.Contributions)
            .WithOne()
            .HasForeignKey(contribution => contribution.SavingGoalId)
            .OnDelete(DeleteBehavior.Cascade);

        // The collection is exposed read-only and backed by a private list.
        builder.Navigation(x => x.Contributions)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
