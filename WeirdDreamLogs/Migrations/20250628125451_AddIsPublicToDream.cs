using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeirdDreamLogs.Migrations
{
    /// <inheritdoc />
    public partial class AddIsPublicToDream : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Dreams",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Dreams");
        }
    }
}
