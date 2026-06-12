using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Transactions;

internal sealed class TransactionConfiguration : EntityConfiguration<Transaction>
{
    public override void Configure(EntityTypeBuilder<Transaction> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.CategoryId);

        // Restrict: a pocket referenced by any transaction cannot be deleted at the DB
        // level (the application also blocks deleting a pocket with a non-zero balance).
        builder.HasOne<Pocket>()
            .WithMany()
            .HasForeignKey(x => x.FromPocketId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne<Pocket>()
            .WithMany()
            .HasForeignKey(x => x.ToPocketId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.FromPocketId);
        builder.HasIndex(x => x.ToPocketId);

        // Optional tag linking a contribution to a saving goal.
        builder.HasOne<SavingGoal>()
            .WithMany()
            .HasForeignKey(x => x.SavingGoalId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.SavingGoalId);
    }
}
