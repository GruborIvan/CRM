using CRMService.Domain.Idents;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CRMService.Infrastructure.Persistence.Configurations;

public class IdentConfiguration : IEntityTypeConfiguration<Ident>
{
    public void Configure(EntityTypeBuilder<Ident> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Type)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(i => i.Value)
            .IsRequired()
            .HasMaxLength(100);
    }
}
