using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class AssetStatusHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AssetId { get; set; }
    public AssetStatus PreviousStatus { get; set; }
    public AssetStatus NewStatus { get; set; }
    public string? Reason { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    public Asset Asset { get; set; } = null!;
}