using FinPlan.Domain.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Activities;

internal sealed class ActivityExpenseConfiguration : EntityConfiguration<ActivityExpense>
{
    public override void Configure(EntityTypeBuilder<ActivityExpense> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.ActivityId);
        builder.HasIndex(x => x.PaidByUserId);

        // Cascade: deleting a activity removes its expenses too.
        builder.HasOne<Activity>()
            .WithMany()
            .HasForeignKey(x => x.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Splits)
            .WithOne()
            .HasForeignKey(split => split.ActivityExpenseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Splits)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
