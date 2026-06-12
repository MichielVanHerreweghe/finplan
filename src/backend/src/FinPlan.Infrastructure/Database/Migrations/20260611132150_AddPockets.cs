using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddPockets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SavingGoalContribution",
                schema: "finplan");

            migrationBuilder.AddColumn<int>(
                name: "FromPocketId",
                schema: "finplan",
                table: "Transaction",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ToPocketId",
                schema: "finplan",
                table: "Transaction",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PocketId",
                schema: "finplan",
                table: "SavingGoal",
                type: "integer",
                nullable: false,
                defaultValue: 0);

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
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
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

            // Backfill: create a default "Main" pocket and attach records that predate pockets to it,
            // so balances and the now-required SavingGoal.PocketId are consistent from the first run.
            // Runs before the indexes/foreign keys below are created, so they validate against this data.
            migrationBuilder.Sql(@"
                DO $$
                DECLARE
                    main_id integer;
                    goal RECORD;
                    goal_pocket_id integer;
                BEGIN
                    -- Default pocket for transactions that predate pockets.
                    INSERT INTO finplan.""Pocket"" (""Name"", ""Description"", ""ParentPocketId"", ""UpdatedAt"", ""DeletedAt"")
                    VALUES ('Main', 'Default pocket for records created before pockets existed.', NULL, (now() AT TIME ZONE 'utc'), NULL)
                    RETURNING ""Id"" INTO main_id;

                    UPDATE finplan.""Transaction"" SET ""ToPocketId"" = main_id WHERE ""Type"" = 1 AND ""ToPocketId"" IS NULL;
                    UPDATE finplan.""Transaction"" SET ""FromPocketId"" = main_id WHERE ""Type"" = 2 AND ""FromPocketId"" IS NULL;

                    -- PocketId is now required and unique per goal, so give each pre-existing goal its own pocket.
                    FOR goal IN SELECT ""Id"", ""Name"" FROM finplan.""SavingGoal"" WHERE ""PocketId"" = 0 LOOP
                        INSERT INTO finplan.""Pocket"" (""Name"", ""Description"", ""ParentPocketId"", ""UpdatedAt"", ""DeletedAt"")
                        VALUES (goal.""Name"", 'Auto-created pocket for an existing saving goal.', NULL, (now() AT TIME ZONE 'utc'), NULL)
                        RETURNING ""Id"" INTO goal_pocket_id;

                        UPDATE finplan.""SavingGoal"" SET ""PocketId"" = goal_pocket_id WHERE ""Id"" = goal.""Id"";
                    END LOOP;
                END $$;
            ");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_FromPocketId",
                schema: "finplan",
                table: "Transaction",
                column: "FromPocketId");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_ToPocketId",
                schema: "finplan",
                table: "Transaction",
                column: "ToPocketId");

            migrationBuilder.CreateIndex(
                name: "IX_SavingGoal_PocketId",
                schema: "finplan",
                table: "SavingGoal",
                column: "PocketId",
                unique: true,
                filter: "\"DeletedAt\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Pocket_ParentPocketId",
                schema: "finplan",
                table: "Pocket",
                column: "ParentPocketId");

            migrationBuilder.AddForeignKey(
                name: "FK_SavingGoal_Pocket_PocketId",
                schema: "finplan",
                table: "SavingGoal",
                column: "PocketId",
                principalSchema: "finplan",
                principalTable: "Pocket",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Pocket_FromPocketId",
                schema: "finplan",
                table: "Transaction",
                column: "FromPocketId",
                principalSchema: "finplan",
                principalTable: "Pocket",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Pocket_ToPocketId",
                schema: "finplan",
                table: "Transaction",
                column: "ToPocketId",
                principalSchema: "finplan",
                principalTable: "Pocket",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SavingGoal_Pocket_PocketId",
                schema: "finplan",
                table: "SavingGoal");

            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Pocket_FromPocketId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Pocket_ToPocketId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropTable(
                name: "Pocket",
                schema: "finplan");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_FromPocketId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_ToPocketId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropIndex(
                name: "IX_SavingGoal_PocketId",
                schema: "finplan",
                table: "SavingGoal");

            migrationBuilder.DropColumn(
                name: "FromPocketId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "ToPocketId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "PocketId",
                schema: "finplan",
                table: "SavingGoal");

            migrationBuilder.CreateTable(
                name: "SavingGoalContribution",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Amount = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SavingGoalId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SavingGoalContribution", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SavingGoalContribution_SavingGoal_SavingGoalId",
                        column: x => x.SavingGoalId,
                        principalSchema: "finplan",
                        principalTable: "SavingGoal",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SavingGoalContribution_SavingGoalId",
                schema: "finplan",
                table: "SavingGoalContribution",
                column: "SavingGoalId");
        }
    }
}
