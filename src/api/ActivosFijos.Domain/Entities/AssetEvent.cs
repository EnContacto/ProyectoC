using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class AssetEvent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AssetId { get; set; }
    public AssetEventType EventType { get; set; }
    public DateTime EventDate { get; set; }
    public string? Reason { get; set; }
    public decimal? Amount { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Asset Asset { get; set; } = null!;
}