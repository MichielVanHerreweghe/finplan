using FinPlan.Domain.Invitations;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Invitations;

internal sealed class InvitationConfiguration : EntityConfiguration<Invitation>
{
    public override void Configure(EntityTypeBuilder<Invitation> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.ToUserId);
        builder.HasIndex(x => x.FromUserId);
        builder.HasIndex(x => new { x.Type, x.TargetId });
    }
}
