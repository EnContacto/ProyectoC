using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class CustodianConfiguration : IEntityTypeConfiguration<Custodian>
{
    public void Configure(EntityTypeBuilder<Custodian> b)
    {
        b.ToTable("Custodians");
        b.HasKey(x => x.Id);
        b.Property(x => x.Name).HasMaxLength(200).IsRequired();
        b.Property(x => x.Department).HasMaxLength(200);
        b.HasIndex(x => x.Name);
    }
}