using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class FilterContactUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Contact_OwnerUserId_ContactUserId",
                schema: "finplan",
                table: "Contact");

            migrationBuilder.CreateIndex(
                name: "IX_Contact_OwnerUserId_ContactUserId",
                schema: "finplan",
                table: "Contact",
                columns: new[] { "OwnerUserId", "ContactUserId" },
                unique: true,
                filter: "\"DeletedAt\" IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Contact_OwnerUserId_ContactUserId",
                schema: "finplan",
                table: "Contact");

            migrationBuilder.CreateIndex(
                name: "IX_Contact_OwnerUserId_ContactUserId",
                schema: "finplan",
                table: "Contact",
                columns: new[] { "OwnerUserId", "ContactUserId" },
                unique: true);
        }
    }
}
