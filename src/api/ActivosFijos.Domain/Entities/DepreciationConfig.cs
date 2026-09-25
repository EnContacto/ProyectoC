namespace ActivosFijos.Domain.Entities;

public class DepreciationConfig
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? CompanyId { get; set; }
    public Guid? CategoryId { get; set; }
    public int DefaultUsefulLifeYears { get; set; }
    public decimal DefaultResidualRate { get; set; }
    public DateTime EffectiveFrom { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}