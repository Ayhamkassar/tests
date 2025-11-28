using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SyriaZone.Migrations
{
    /// <inheritdoc />
    public partial class adddate2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "Stores",
                newName: "LastUpdatedAt");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Stores",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Stores");

            migrationBuilder.RenameColumn(
                name: "LastUpdatedAt",
                table: "Stores",
                newName: "Date");
        }
    }
}
