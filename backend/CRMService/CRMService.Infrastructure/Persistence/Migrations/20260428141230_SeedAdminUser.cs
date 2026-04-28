using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMService.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SeedAdminUser : Migration
    {
        private static readonly Guid AdminId = new("a1b2c3d4-0000-0000-0000-000000000001");

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Users",
                columns: ["Id", "Username", "Email", "PasswordHash", "RefreshToken", "RefreshTokenExpiresAt", "CreatedAt", "UpdatedAt"],
                values: [
                    AdminId,
                    "admin",
                    "admin@crmservice.local",
                    "$2a$11$lS0jjOd6NXLkGi9Wm28R1ubyPAlYBRTCZYtyAZdd3s5RxuTTkRVGS",
                    null,
                    null,
                    DateTime.UtcNow,
                    null
                ]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: AdminId);
        }
    }
}
