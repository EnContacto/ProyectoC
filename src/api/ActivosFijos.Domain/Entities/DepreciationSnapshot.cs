namespace ActivosFijos.Domain.Entities;

public class DepreciationSnapshot
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public DateTime SnapshotDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<DepreciationSchedule> Schedules { get; set; } = new List<DepreciationSchedule>();
}