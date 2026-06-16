using FinPlan.Domain.Contacts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FinPlan.Infrastructure.Database.Configurations.Contacts;

internal sealed class ContactConfiguration : EntityConfiguration<Contact>
{
    public override void Configure(EntityTypeBuilder<Contact> builder)
    {
        base.Configure(builder);

        builder.HasIndex(x => x.OwnerUserId);

        // A user can only add a given contact once. Filtered to live rows so a soft-deleted
        // (removed) contact doesn't block re-adding the same person later.
        builder.HasIndex(x => new { x.OwnerUserId, x.ContactUserId })
            .IsUnique()
            .HasFilter("\"DeletedAt\" IS NULL");
    }
}
