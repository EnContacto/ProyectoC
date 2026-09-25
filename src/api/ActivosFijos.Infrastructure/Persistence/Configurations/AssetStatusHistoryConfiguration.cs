using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class AssetStatusHistoryConfiguration : IEntityTypeConfiguration<AssetStatusHistory>
{
    public void Configure(EntityTypeBuilder<AssetStatusHistory> b)
    {
        b.ToTable("AssetStatusHistories");
        b.HasKey(x => x.Id);

        b.Property(x => x.Reason).HasMaxLength(500);

        b.HasOne(x => x.Asset)
         .WithMany(a => a.StatusHistory)
         .HasForeignKey(x => x.AssetId)
         .OnDelete(DeleteBehavior.Cascade);

        b.HasIndex(x => x.AssetId);
        b.HasIndex(x => x.ChangedAt);
    }
}