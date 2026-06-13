using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace FinPlan.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnersAndGroups : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OwnerId",
                schema: "finplan",
                table: "User",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Owner",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Kind = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Owner", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Group",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    OwnerId = table.Column<int>(type: "integer", nullable: false),
                    CreatedByUserId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Group", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Group_Owner_OwnerId",
                        column: x => x.OwnerId,
                        principalSchema: "finplan",
                        principalTable: "Owner",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GroupMember",
                schema: "finplan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    GroupId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DeletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GroupMember", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GroupMember_Group_GroupId",
                        column: x => x.GroupId,
                        principalSchema: "finplan",
                        principalTable: "Group",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_User_OwnerId",
                schema: "finplan",
                table: "User",
                column: "OwnerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_OwnerId",
                schema: "finplan",
                table: "Transaction",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_SavingGoal_OwnerId",
                schema: "finplan",
                table: "SavingGoal",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Pocket_OwnerId",
                schema: "finplan",
                table: "Pocket",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Group_CreatedByUserId",
                schema: "finplan",
                table: "Group",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Group_OwnerId",
                schema: "finplan",
                table: "Group",
                column: "OwnerId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_GroupMember_GroupId_UserId",
                schema: "finplan",
                table: "GroupMember",
                columns: new[] { "GroupId", "UserId" },
                unique: true,
                filter: "\"DeletedAt\" IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_GroupMember_UserId",
                schema: "finplan",
                table: "GroupMember",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Owner_Kind",
                schema: "finplan",
                table: "Owner",
                column: "Kind");

            migrationBuilder.AddForeignKey(
                name: "FK_Pocket_Owner_OwnerId",
                schema: "finplan",
                table: "Pocket",
                column: "OwnerId",
                principalSchema: "finplan",
                principalTable: "Owner",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SavingGoal_Owner_OwnerId",
                schema: "finplan",
                table: "SavingGoal",
                column: "OwnerId",
                principalSchema: "finplan",
                principalTable: "Owner",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Owner_OwnerId",
                schema: "finplan",
                table: "Transaction",
                column: "OwnerId",
                principalSchema: "finplan",
                principalTable: "Owner",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_TransactionCategory_Owner_OwnerId",
                schema: "finplan",
                table: "TransactionCategory",
                column: "OwnerId",
                principalSchema: "finplan",
                principalTable: "Owner",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_User_Owner_OwnerId",
                schema: "finplan",
                table: "User",
                column: "OwnerId",
                principalSchema: "finplan",
                principalTable: "Owner",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pocket_Owner_OwnerId",
                schema: "finplan",
                table: "Pocket");

            migrationBuilder.DropForeignKey(
                name: "FK_SavingGoal_Owner_OwnerId",
                schema: "finplan",
                table: "SavingGoal");

            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Owner_OwnerId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropForeignKey(
                name: "FK_TransactionCategory_Owner_OwnerId",
                schema: "finplan",
                table: "TransactionCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_User_Owner_OwnerId",
                schema: "finplan",
                table: "User");

            migrationBuilder.DropTable(
                name: "GroupMember",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "Group",
                schema: "finplan");

            migrationBuilder.DropTable(
                name: "Owner",
                schema: "finplan");

            migrationBuilder.DropIndex(
                name: "IX_User_OwnerId",
                schema: "finplan",
                table: "User");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_OwnerId",
                schema: "finplan",
                table: "Transaction");

            migrationBuilder.DropIndex(
                name: "IX_SavingGoal_OwnerId",
                schema: "finplan",
                table: "SavingGoal");

            migrationBuilder.DropIndex(
                name: "IX_Pocket_OwnerId",
                schema: "finplan",
                table: "Pocket");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                schema: "finplan",
                table: "User");
        }
    }
}
