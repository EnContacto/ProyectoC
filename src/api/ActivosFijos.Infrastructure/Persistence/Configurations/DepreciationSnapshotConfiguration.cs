using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class DepreciationSnapshotConfiguration : IEntityTypeConfiguration<DepreciationSnapshot>
{
    public void Configure(EntityTypeBuilder<DepreciationSnapshot> b)
    {
        b.ToTable("DepreciationSnapshots");
        b.HasKey(x => x.Id);

        b.Property(x => x.Name).HasMaxLength(200).IsRequired();
        b.Property(x => x.Notes).HasMaxLength(1000);

        b.HasIndex(x => x.SnapshotDate);
    }
}