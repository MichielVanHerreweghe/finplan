using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddContactLedger : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactExpense",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserAId = table.Column<int>(type: "integer", nullable: false),
                    UserBId = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    PaidByUserId = table.Column<int>(type: "integer", nullable: false),
                    SplitType = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactExpense", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactSettlement",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserAId = table.Column<int>(type: "integer", nullable: false),
                    UserBId = table.Column<int>(type: "integer", nullable: false),
                    FromUserId = table.Column<int>(type: "integer", nullable: false),
                    ToUserId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactSettlement", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ContactExpenseSplit",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ContactExpenseId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactExpenseSplit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContactExpenseSplit_ContactExpense_ContactExpenseId",
                        column: x => x.ContactExpenseId,
                        principalSchema: "finplan",
                        principalTable: "ContactExpense",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ContactExpense_PaidByUserId",
                schema: "finplan",
                table: "ContactExpense",
                column: "PaidByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactExpense_UserAId_UserBId",
                schema: "finplan",
                table: "ContactExpense",
                columns: new[] { "UserAId", "UserBId" });

            migrationBuilder.CreateIndex(
                name: "IX_ContactExpenseSplit_ContactExpenseId",
                schema: "finplan",
                table: "ContactExpenseSplit",
                column: "ContactExpenseId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactExpenseSplit_UserId",
                schema: "finplan",
                table: "ContactExpenseSplit",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ContactSettlement_UserAId_UserBId",
                schema: "finplan",
                table: "ContactSettlement",
                columns: new[] { "UserAId", "UserBId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactExpenseSplit",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "ContactSettlement",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "ContactExpense",
                schema: "finplan");
        }
    }
}
