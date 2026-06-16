using FinPlan.Domain.Activities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Activities;

internal sealed class ActivityExpenseSplitConfiguration : EntityConfiguration<ActivityExpenseSplit>
{
    public override void Configure(EntityTypeBuilder<ActivityExpenseSplit> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.UserId);
    }
}
