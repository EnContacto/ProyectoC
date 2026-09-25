using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class ImportError
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ImportBatchId { get; set; }
    public int RowNumber { get; set; }
    public string? ColumnName { get; set; }
    public ImportErrorSeverity Severity { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? RawValue { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ImportBatch ImportBatch { get; set; } = null!;
}