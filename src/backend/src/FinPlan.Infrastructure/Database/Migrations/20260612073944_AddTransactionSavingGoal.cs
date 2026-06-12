using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionSavingGoal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SavingGoalId",
                schema: "finplan",
                table: "Transaction",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_SavingGoalId",
                schema: "finplan",
                table: "Transaction",
                column: "SavingGoalId");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_SavingGoal_SavingGoalId",
                schema: "finplan",
                table: "Transaction",
                column: "SavingGoalId",
                principalSchema: "finplan",
                principalTable: "SavingGoal",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_SavingGoal_SavingGoalId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_SavingGoalId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "SavingGoalId",
                schema: "finplan",
                table: "Transaction");
        }
    }
}
