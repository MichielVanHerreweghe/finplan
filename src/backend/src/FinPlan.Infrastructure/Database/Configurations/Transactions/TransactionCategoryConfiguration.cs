using FinPlan.Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Transactions;

internal sealed class TransactionCategoryConfiguration : EntityConfiguration<TransactionCategory>
{
    public override void Configure(EntityTypeBuilder<TransactionCategory> builder)
    {
        base.Configure(builder);

        // Scoped to the owner so two users can each have a "Groceries" category.
        builder.HasIndex(x => new { x.OwnerId, x.Name })
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");
    }
}