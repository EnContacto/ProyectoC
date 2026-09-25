using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class ImportStagingConfiguration : IEntityTypeConfiguration<ImportStaging>
{
    public void Configure(EntityTypeBuilder<ImportStaging> b)
    {
        b.ToTable("ImportStaging");
        b.HasKey(x => x.Id);

        b.Property(x => x.SheetName).HasMaxLength(150);
        b.Property(x => x.RawJson).HasColumnType("nvarchar(max)");
        b.Property(x => x.NormalizedJson).HasColumnType("nvarchar(max)");

        b.HasOne(x => x.ImportBatch)
         .WithMany(i => i.StagingRows)
         .HasForeignKey(x => x.ImportBatchId)
         .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(x => x.ImportBatchId);
        b.HasIndex(x => x.IsValid);
        b.HasIndex(x => x.IsDuplicate);
        b.HasIndex(x => x.AssetId);
    }
}