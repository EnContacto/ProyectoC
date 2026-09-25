namespace ActivosFijos.Domain.Entities;

public class DepreciationSchedule
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AssetId { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal AccumulatedDepreciation { get; set; }
    public decimal NetCost { get; set; }
    public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

    public Asset Asset { get; set; } = null!;
}