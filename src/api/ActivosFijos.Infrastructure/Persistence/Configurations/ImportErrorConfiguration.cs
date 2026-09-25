using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class ImportErrorConfiguration : IEntityTypeConfiguration<ImportError>
{
    public void Configure(EntityTypeBuilder<ImportError> b)
    {
        b.ToTable("ImportErrors");
        b.HasKey(x => x.Id);

        b.Property(x => x.ColumnName).HasMaxLength(200);
        b.Property(x => x.Message).HasMaxLength(1000).IsRequired();
        b.Property(x => x.RawValue).HasMaxLength(1000);

        b.HasOne(x => x.ImportBatch)
         .WithMany(i => i.Errors)
         .HasForeignKey(x => x.ImportBatchId)
         .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(x => x.ImportBatchId);
        b.HasIndex(x => x.Severity);
    }
}