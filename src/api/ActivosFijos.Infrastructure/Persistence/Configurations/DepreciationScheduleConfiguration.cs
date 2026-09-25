using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class DepreciationScheduleConfiguration : IEntityTypeConfiguration<DepreciationSchedule>
{
    public void Configure(EntityTypeBuilder<DepreciationSchedule> b)
    {
        b.ToTable("DepreciationSchedules");
        b.HasKey(x => x.Id);

        b.Property(x => x.DepreciationAmount).HasPrecision(18, 2);
        b.Property(x => x.AccumulatedDepreciation).HasPrecision(18, 2);
        b.Property(x => x.NetCost).HasPrecision(18, 2);

        b.HasOne(x => x.Asset)
         .WithMany(a => a.DepreciationSchedules)
         .HasForeignKey(x => x.AssetId)
         .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(x => x.AssetId);
        b.HasIndex(x => new { x.AssetId, x.Year, x.Month }).IsUnique();
    }
}