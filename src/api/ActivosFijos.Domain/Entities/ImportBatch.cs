using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class ImportBatch
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FileName { get; set; } = string.Empty;
    public string? FileHash { get; set; }
    public ImportBatchStatus Status { get; set; } = ImportBatchStatus.Pendiente;
    public int TotalRows { get; set; }
    public int ProcessedRows { get; set; }
    public int SuccessRows { get; set; }
    public int ErrorRows { get; set; }
    public string? ErrorMessage { get; set; }
    public DateTime StartedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public Guid? RevertedByBatchId { get; set; }

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
    public ICollection<ImportError> Errors { get; set; } = new List<ImportError>();
    public ICollection<ImportStaging> StagingRows { get; set; } = new List<ImportStaging>();
}