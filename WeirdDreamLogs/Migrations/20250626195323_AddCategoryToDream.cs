using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WeirdDreamLogs.Migrations
{
    /// <inheritdoc />
    public partial class AddCategoryToDream : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Dreams",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Category",
                table: "Dreams");
        }
    }
}
