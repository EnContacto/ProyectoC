using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class ImportBatchConfiguration : IEntityTypeConfiguration<ImportBatch>
{
    public void Configure(EntityTypeBuilder<ImportBatch> b)
    {
        b.ToTable("ImportBatches");
        b.HasKey(x => x.Id);

        b.Property(x => x.FileName).HasMaxLength(300).IsRequired();
        b.Property(x => x.FileHash).HasMaxLength(128);
        b.Property(x => x.ErrorMessage).HasMaxLength(2000);

        b.HasIndex(x => x.Status);
        b.HasIndex(x => x.StartedAt);
        b.HasIndex(x => x.FileHash);
    }
}