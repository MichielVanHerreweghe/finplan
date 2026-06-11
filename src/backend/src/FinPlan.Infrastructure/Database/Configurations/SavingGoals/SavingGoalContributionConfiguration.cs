using FinPlan.Domain.SavingGoals;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.SavingGoals;

internal sealed class SavingGoalContributionConfiguration : EntityConfiguration<SavingGoalContribution>
{
    public override void Configure(EntityTypeBuilder<SavingGoalContribution> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.SavingGoalId);
    }
}
