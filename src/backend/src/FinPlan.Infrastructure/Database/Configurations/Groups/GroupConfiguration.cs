using FinPlan.Domain.Common;
using FinPlan.Domain.Groups;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Groups;

internal sealed class GroupConfiguration : EntityConfiguration<Group>
{
    public override void Configure(EntityTypeBuilder<Group> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.CreatedByUserId);
        builder.HasIndex(x => x.OwnerId).IsUnique();

        // The group's data owner, created with the group. Restrict: an owner with data can't be
        // deleted at the DB level.
        builder.HasOne(x => x.Owner)
            .WithMany()
            .HasForeignKey(x => x.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        // Members are owned by the group: loaded through the navigation, cascade-deleted with it.
        builder.HasMany(x => x.Members)
            .WithOne()
            .HasForeignKey(member => member.GroupId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(x => x.Members)
            .UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
