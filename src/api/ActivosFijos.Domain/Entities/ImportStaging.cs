using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class ImportStaging
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ImportBatchId { get; set; }
    public int RowNumber { get; set; }
    public string? SheetName { get; set; }
    public string? RawJson { get; set; }
    public string? NormalizedJson { get; set; }
    public bool IsValid { get; set; }
    public bool IsDuplicate { get; set; }
    public AssetQualityFlag? QualityFlag { get; set; }
    public Guid? AssetId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ImportBatch ImportBatch { get; set; } = null!;
}