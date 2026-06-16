using FinPlan.Domain.Contacts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Contacts;

internal sealed class ContactSettlementConfiguration : EntityConfiguration<ContactSettlement>
{
    public override void Configure(EntityTypeBuilder<ContactSettlement> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => new { x.UserAId, x.UserBId });
    }
}
