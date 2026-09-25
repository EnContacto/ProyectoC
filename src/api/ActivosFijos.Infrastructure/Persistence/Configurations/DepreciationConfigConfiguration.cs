using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class DepreciationConfigConfiguration : IEntityTypeConfiguration<DepreciationConfig>
{
    public void Configure(EntityTypeBuilder<DepreciationConfig> b)
    {
        b.ToTable("DepreciationConfigs");
        b.HasKey(x => x.Id);

        b.Property(x => x.DefaultResidualRate).HasPrecision(18, 6);

        b.HasIndex(x => new { x.CompanyId, x.CategoryId, x.EffectiveFrom });
    }
}