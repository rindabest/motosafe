using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MotorSafe.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddCccdToUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cccd",
                table: "Users",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cccd",
                table: "Users");
        }
    }
}
