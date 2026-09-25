using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class ReportRun
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? TemplateId { get; set; }
    public ReportType ReportType { get; set; }
    public string? FiltersJson { get; set; }
    public string? ColumnsJson { get; set; }
    public int RowCount { get; set; }
    public DateTime RunAt { get; set; } = DateTime.UtcNow;
}