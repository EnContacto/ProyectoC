using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class ReportRunConfiguration : IEntityTypeConfiguration<ReportRun>
{
    public void Configure(EntityTypeBuilder<ReportRun> b)
    {
        b.ToTable("ReportRuns");
        b.HasKey(x => x.Id);

        b.Property(x => x.FiltersJson).HasColumnType("nvarchar(max)");
        b.Property(x => x.ColumnsJson).HasColumnType("nvarchar(max)");

        b.HasIndex(x => x.ReportType);
        b.HasIndex(x => x.RunAt);
        b.HasIndex(x => x.TemplateId);
    }
}