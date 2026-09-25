using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class AssetEventConfiguration : IEntityTypeConfiguration<AssetEvent>
{
    public void Configure(EntityTypeBuilder<AssetEvent> b)
    {
        b.ToTable("AssetEvents");
        b.HasKey(x => x.Id);

        b.Property(x => x.Reason).HasMaxLength(500);
        b.Property(x => x.Notes).HasMaxLength(2000);
        b.Property(x => x.Amount).HasPrecision(18, 2);

        b.HasOne(x => x.Asset)
         .WithMany(a => a.Events)
         .HasForeignKey(x => x.AssetId)
         .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(x => x.AssetId);
        b.HasIndex(x => x.EventType);
        b.HasIndex(x => x.EventDate);
    }
}