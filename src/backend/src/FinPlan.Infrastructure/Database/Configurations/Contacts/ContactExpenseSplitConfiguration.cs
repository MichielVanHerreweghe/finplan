using FinPlan.Domain.Contacts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Contacts;

internal sealed class ContactExpenseSplitConfiguration : EntityConfiguration<ContactExpenseSplit>
{
    public override void Configure(EntityTypeBuilder<ContactExpenseSplit> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.UserId);
    }
}
