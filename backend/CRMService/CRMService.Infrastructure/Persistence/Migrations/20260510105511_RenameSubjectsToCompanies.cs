using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CRMService.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameSubjectsToCompanies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop FKs before touching the referenced table/columns
            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_Subjects_SubjectId",
                table: "Contacts");

            migrationBuilder.DropForeignKey(
                name: "FK_Idents_Subjects_SubjectId",
                table: "Idents");

            // Rename table — preserves all existing rows
            migrationBuilder.RenameTable(
                name: "Subjects",
                newName: "Companies");

            // Rename FK columns
            migrationBuilder.RenameColumn(
                name: "SubjectId",
                table: "Contacts",
                newName: "CompanyId");

            migrationBuilder.RenameColumn(
                name: "SubjectId",
                table: "Idents",
                newName: "CompanyId");

            // Rename indexes to match new column names
            migrationBuilder.RenameIndex(
                name: "IX_Contacts_SubjectId",
                table: "Contacts",
                newName: "IX_Contacts_CompanyId");

            migrationBuilder.RenameIndex(
                name: "IX_Idents_SubjectId",
                table: "Idents",
                newName: "IX_Idents_CompanyId");

            // Re-add FKs with updated names pointing to the renamed table/column
            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_Companies_CompanyId",
                table: "Contacts",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Idents_Companies_CompanyId",
                table: "Idents",
                column: "CompanyId",
                principalTable: "Companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contacts_Companies_CompanyId",
                table: "Contacts");

            migrationBuilder.DropForeignKey(
                name: "FK_Idents_Companies_CompanyId",
                table: "Idents");

            migrationBuilder.RenameTable(
                name: "Companies",
                newName: "Subjects");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "Contacts",
                newName: "SubjectId");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "Idents",
                newName: "SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Contacts_CompanyId",
                table: "Contacts",
                newName: "IX_Contacts_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Idents_CompanyId",
                table: "Idents",
                newName: "IX_Idents_SubjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Contacts_Subjects_SubjectId",
                table: "Contacts",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Idents_Subjects_SubjectId",
                table: "Idents",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
