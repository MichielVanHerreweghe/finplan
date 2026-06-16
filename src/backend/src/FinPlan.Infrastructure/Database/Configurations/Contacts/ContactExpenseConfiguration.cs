using FinPlan.Domain.Contacts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Contacts;

internal sealed class ContactExpenseConfiguration : EntityConfiguration<ContactExpense>
{
    public override void Configure(EntityTypeBuilder<ContactExpense> builder)
    {
        base.Configure(builder);

        // The canonical pair is the lookup key for a ledger; PaidByUserId for balance scans.
        builder.HasIndex(x => new { x.UserAId, x.UserBId });
        builder.HasIndex(x => x.PaidByUserId);

        builder.HasMany(x => x.Splits)
            .WithOne()
            .HasForeignKey(split => split.ContactExpenseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Splits)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
