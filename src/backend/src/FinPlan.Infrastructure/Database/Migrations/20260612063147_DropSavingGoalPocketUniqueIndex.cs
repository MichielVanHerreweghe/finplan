using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class DropSavingGoalPocketUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SavingGoal_PocketId",
                schema: "finplan",
                table: "SavingGoal");

            migrationBuilder.CreateIndex(
                name: "IX_SavingGoal_PocketId",
                schema: "finplan",
                table: "SavingGoal",
                column: "PocketId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SavingGoal_PocketId",
                schema: "finplan",
                table: "SavingGoal");

            migrationBuilder.CreateIndex(
                name: "IX_SavingGoal_PocketId",
                schema: "finplan",
                table: "SavingGoal",
                column: "PocketId",
                unique: true,
                filter: "\"DeletedAt\" IS NULL");
        }
    }
}
