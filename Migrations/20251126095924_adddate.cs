using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SyriaZone.Migrations
{
    /// <inheritdoc />
    public partial class adddate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Products",
                newName: "ImageUrls");

            migrationBuilder.AddColumn<DateTime>(
                name: "Date",
                table: "Stores",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Stores",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Stores");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Stores");

            migrationBuilder.RenameColumn(
                name: "ImageUrls",
                table: "Products",
                newName: "ImageUrl");
        }
    }
}
