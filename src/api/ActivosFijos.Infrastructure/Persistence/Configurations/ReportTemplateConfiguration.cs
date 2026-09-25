using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class ReportTemplateConfiguration : IEntityTypeConfiguration<ReportTemplate>
{
    public void Configure(EntityTypeBuilder<ReportTemplate> b)
    {
        b.ToTable("ReportTemplates");
        b.HasKey(x => x.Id);

        b.Property(x => x.Name).HasMaxLength(200).IsRequired();
        b.Property(x => x.FiltersJson).HasColumnType("nvarchar(max)");
        b.Property(x => x.ColumnsJson).HasColumnType("nvarchar(max)");
        b.Property(x => x.SortJson).HasColumnType("nvarchar(max)");

        b.HasIndex(x => x.ReportType);
        b.HasIndex(x => x.Name);
    }
}