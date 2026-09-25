using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class AssetConfiguration : IEntityTypeConfiguration<Asset>
{
    public void Configure(EntityTypeBuilder<Asset> b)
    {
        b.ToTable("Assets");
        b.HasKey(x => x.Id);

        b.Property(x => x.CurrentCode).HasMaxLength(20).IsRequired();
        b.HasIndex(x => x.CurrentCode).IsUnique();

        b.Property(x => x.Name).HasMaxLength(300).IsRequired();
        b.Property(x => x.Detail).HasMaxLength(1000);
        b.Property(x => x.Brand).HasMaxLength(150);
        b.Property(x => x.Model).HasMaxLength(150);
        b.Property(x => x.Serial).HasMaxLength(200);
        b.Property(x => x.Components).HasMaxLength(1000);
        b.Property(x => x.Capacity).HasMaxLength(150);
        b.Property(x => x.Dimensions).HasMaxLength(150);
        b.Property(x => x.Material).HasMaxLength(150);
        b.Property(x => x.Color).HasMaxLength(80);
        b.Property(x => x.InvoiceNumber).HasMaxLength(80);
        b.Property(x => x.Provider).HasMaxLength(250);
        b.Property(x => x.SpecificLocation).HasMaxLength(250);
        b.Property(x => x.ManualReviewReason).HasMaxLength(500);
        b.Property(x => x.Notes).HasMaxLength(2000);
        b.Property(x => x.ExternalRowReference).HasMaxLength(100);

        b.Property(x => x.AcquisitionValue).HasPrecision(18, 2);
        b.Property(x => x.PriorResidualValue).HasPrecision(18, 2);
        b.Property(x => x.ResidualRate).HasPrecision(18, 6);
        b.Property(x => x.DepreciableAmount).HasPrecision(18, 2);
        b.Property(x => x.DepreciationRate).HasPrecision(18, 6);
        b.Property(x => x.AccumulatedDepreciation).HasPrecision(18, 2);
        b.Property(x => x.NetCost).HasPrecision(18, 2);

        b.HasOne(x => x.Company).WithMany(c => c.Assets).HasForeignKey(x => x.CompanyId);
        b.HasOne(x => x.Category).WithMany(c => c.Assets).HasForeignKey(x => x.CategoryId);
        b.HasOne(x => x.Location).WithMany(l => l.Assets).HasForeignKey(x => x.LocationId);
        b.HasOne(x => x.Custodian).WithMany(c => c.Assets).HasForeignKey(x => x.CustodianId);
        b.HasOne(x => x.AccountingAccount).WithMany(a => a.Assets).HasForeignKey(x => x.AccountingAccountId);
        b.HasOne(x => x.ImportBatch).WithMany(i => i.Assets).HasForeignKey(x => x.ImportBatchId);

        b.HasIndex(x => new { x.CompanyId, x.CategoryId });
        b.HasIndex(x => x.PurchaseDate);
        b.HasIndex(x => x.Status);
        b.HasIndex(x => x.Classification);
        b.HasIndex(x => x.QualityFlag);
    }
}