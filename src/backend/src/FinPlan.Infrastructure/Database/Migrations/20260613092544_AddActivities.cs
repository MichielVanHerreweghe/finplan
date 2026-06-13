using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddActivities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Activity",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    CreatedByUserId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activity", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ActivityExpense",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ActivityId = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_ActivityExpense", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityExpense_Activity_ActivityId",
                        column: x => x.ActivityId,
                        principalSchema: "finplan",
                        principalTable: "Activity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityMember",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ActivityId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityMember_Activity_ActivityId",
                        column: x => x.ActivityId,
                        principalSchema: "finplan",
                        principalTable: "Activity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityExpenseSplit",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ActivityExpenseId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Percentage = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityExpenseSplit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ActivityExpenseSplit_ActivityExpense_ActivityExpenseId",
                        column: x => x.ActivityExpenseId,
                        principalSchema: "finplan",
                        principalTable: "ActivityExpense",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activity_CreatedByUserId",
                schema: "finplan",
                table: "Activity",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityExpense_ActivityId",
                schema: "finplan",
                table: "ActivityExpense",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityExpense_PaidByUserId",
                schema: "finplan",
                table: "ActivityExpense",
                column: "PaidByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityExpenseSplit_ActivityExpenseId",
                schema: "finplan",
                table: "ActivityExpenseSplit",
                column: "ActivityExpenseId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityExpenseSplit_UserId",
                schema: "finplan",
                table: "ActivityExpenseSplit",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityMember_ActivityId_UserId",
                schema: "finplan",
                table: "ActivityMember",
                columns: new[] { "ActivityId", "UserId" },
                unique: true,
                filter: "\"DeletedAt\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityMember_UserId",
                schema: "finplan",
                table: "ActivityMember",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityExpenseSplit",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "ActivityMember",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "ActivityExpense",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "Activity",
                schema: "finplan");
        }
    }
}
