using CRMService.Domain.Companies;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRMService.Infrastructure.Persistence.Configurations;

public class CompanyConfiguration : IEntityTypeConfiguration<Company>
{
    public void Configure(EntityTypeBuilder<Company> builder)
    {
        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(c => c.Email).HasMaxLength(200);
        builder.Property(c => c.Phone).HasMaxLength(50);
        builder.Property(c => c.Website).HasMaxLength(300);
        builder.Property(c => c.City).HasMaxLength(100);
        builder.Property(c => c.Address).HasMaxLength(500);
        builder.Property(c => c.Industry).HasMaxLength(100);
        builder.Property(c => c.Notes).HasMaxLength(2000);

        builder.Property(c => c.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.HasMany(c => c.Contacts)
            .WithOne()
            .HasForeignKey(c => c.CompanyId)
            .IsRequired(false)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(c => c.Idents)
            .WithOne()
            .HasForeignKey(i => i.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
