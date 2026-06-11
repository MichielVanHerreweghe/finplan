using FinPlan.Domain.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Transactions;

internal sealed class TransactionCategoryConfiguration : EntityConfiguration<TransactionCategory>
{
    public override void Configure(EntityTypeBuilder<TransactionCategory> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.Name)
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");
    }
}