using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Application.Imports.Dtos;

public class ImportResultDto
{
    public Guid BatchId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public ImportBatchStatus Status { get; set; }
    public int TotalRows { get; set; }
    public int ProcessedRows { get; set; }
    public int SuccessRows { get; set; }
    public int ErrorRows { get; set; }
    public int DuplicateRows { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public List<ImportErrorDto> Errors { get; set; } = new();
}

public class ImportErrorDto
{
    public Guid Id { get; set; }
    public int RowNumber { get; set; }
    public string? ColumnName { get; set; }
    public ImportErrorSeverity Severity { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? RawValue { get; set; }
}

public class ImportPreviewRowDto
{
    public int RowNumber { get; set; }
    public string? SheetName { get; set; }
    public bool IsValid { get; set; }
    public bool IsDuplicate { get; set; }
    public AssetQualityFlag? QualityFlag { get; set; }
    public Dictionary<string, string?> NormalizedFields { get; set; } = new();
}