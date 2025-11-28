using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SyriaZone.Data;
using SyriaZone.Models;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Title).HasMaxLength(150).IsRequired();
        builder.Property(p => p.Price).HasColumnType("decimal(18,2)");
    }
}

