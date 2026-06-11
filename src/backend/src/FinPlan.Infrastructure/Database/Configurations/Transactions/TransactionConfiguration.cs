using FinPlan.Domain.Transactions;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Transactions;

internal sealed class TransactionConfiguration : EntityConfiguration<Transaction>
{
    public override void Configure(EntityTypeBuilder<Transaction> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.CategoryId);
    }
}