using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class ReportTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public ReportType ReportType { get; set; }
    public string? FiltersJson { get; set; }
    public string? ColumnsJson { get; set; }
    public string? SortJson { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}