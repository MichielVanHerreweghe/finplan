using FinPlan.Domain.Pockets;
using FinPlan.Domain.RecurringTransactions;
using FinPlan.Domain.SavingGoals;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.RecurringTransactions;

// Mirrors TransactionConfiguration's relationships (the template fields are identical) and adds
// an index on the NextOccurrence cursor the daily job filters by.
internal sealed class RecurringTransactionConfiguration : EntityConfiguration<RecurringTransaction>
{
    public override void Configure(EntityTypeBuilder<RecurringTransaction> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.CategoryId);

        // Restrict: a pocket referenced by any recurring definition cannot be deleted at the DB level.
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

        builder.HasOne<SavingGoal>()
            .WithMany()
            .HasForeignKey(x => x.SavingGoalId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(x => x.SavingGoalId);

        // The daily job filters all owners' definitions on this cursor; keep it indexed.
        builder.HasIndex(x => x.NextOccurrence);
    }
}
