using FinPlan.Domain.Groups;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Groups;

internal sealed class GroupMemberConfiguration : EntityConfiguration<GroupMember>
{
    public override void Configure(EntityTypeBuilder<GroupMember> builder)
    {
        base.Configure(builder);

        // A user appears at most once per group. Filtered to live rows to match soft-delete.
        builder.HasIndex(x => new { x.GroupId, x.UserId })
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");

        builder.HasIndex(x => x.UserId);
    }
}
