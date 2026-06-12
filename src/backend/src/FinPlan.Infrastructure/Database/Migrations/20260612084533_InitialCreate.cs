using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "finplan");

            migrationBuilder.CreateTable(
                name: "Pocket",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    ParentPocketId = table.Column<int>(type: "integer", nullable: true),
                    StartingAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OwnerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pocket", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pocket_Pocket_ParentPocketId",
                        column: x => x.ParentPocketId,
                        principalSchema: "finplan",
                        principalTable: "Pocket",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TransactionCategory",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OwnerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TransactionCategory", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Issuer = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    ExternalSubject = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Email = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    DisplayName = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SavingGoal",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    TargetAmount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Deadline = table.Column<DateOnly>(type: "date", nullable: true),
                    PocketId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OwnerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavingGoal", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavingGoal_Pocket_PocketId",
                        column: x => x.PocketId,
                        principalSchema: "finplan",
                        principalTable: "Pocket",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Transaction",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Type = table.Column<int>(type: "integer", nullable: false),
                    CategoryId = table.Column<int>(type: "integer", nullable: true),
                    FromPocketId = table.Column<int>(type: "integer", nullable: true),
                    ToPocketId = table.Column<int>(type: "integer", nullable: true),
                    SavingGoalId = table.Column<int>(type: "integer", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    OwnerId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transaction_Pocket_FromPocketId",
                        column: x => x.FromPocketId,
                        principalSchema: "finplan",
                        principalTable: "Pocket",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transaction_Pocket_ToPocketId",
                        column: x => x.ToPocketId,
                        principalSchema: "finplan",
                        principalTable: "Pocket",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Transaction_SavingGoal_SavingGoalId",
                        column: x => x.SavingGoalId,
                        principalSchema: "finplan",
                        principalTable: "SavingGoal",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Pocket_ParentPocketId",
                schema: "finplan",
                table: "Pocket",
                column: "ParentPocketId");

            migrationBuilder.CreateIndex(
                name: "IX_SavingGoal_PocketId",
                schema: "finplan",
                table: "SavingGoal",
                column: "PocketId");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_CategoryId",
                schema: "finplan",
                table: "Transaction",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_FromPocketId",
                schema: "finplan",
                table: "Transaction",
                column: "FromPocketId");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_SavingGoalId",
                schema: "finplan",
                table: "Transaction",
                column: "SavingGoalId");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_ToPocketId",
                schema: "finplan",
                table: "Transaction",
                column: "ToPocketId");

            migrationBuilder.CreateIndex(
                name: "IX_TransactionCategory_OwnerId_Name",
                schema: "finplan",
                table: "TransactionCategory",
                columns: new[] { "OwnerId", "Name" },
                unique: true,
                filter: "\"DeletedAt\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_User_Issuer_ExternalSubject",
                schema: "finplan",
                table: "User",
                columns: new[] { "Issuer", "ExternalSubject" },
                unique: true,
                filter: "\"DeletedAt\" IS NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transaction",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "TransactionCategory",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "User",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "SavingGoal",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "Pocket",
                schema: "finplan");
        }
    }
}
