namespace ActivosFijos.Domain.Entities;

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string ShortCode { get; set; } = string.Empty;
    public int DefaultUsefulLifeYears { get; set; }
    public decimal DefaultResidualRate { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Asset> Assets { get; set; } = new List<Asset>();
}