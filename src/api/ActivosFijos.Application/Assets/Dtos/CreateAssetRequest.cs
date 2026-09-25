using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Application.Assets.Dtos;

public class CreateAssetRequest
{
    public Guid CompanyId { get; set; }
    public Guid CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;
    public string? Detail { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Serial { get; set; }
    public string? Components { get; set; }
    public string? Capacity { get; set; }
    public string? Dimensions { get; set; }
    public string? Material { get; set; }
    public string? Color { get; set; }

    public AssetStatus Status { get; set; } = AssetStatus.Bueno;
    public string? InvoiceNumber { get; set; }
    public string? Provider { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public decimal? AcquisitionValue { get; set; }
    public int? UsefulLifeYears { get; set; }
    public decimal? ResidualRate { get; set; }

    public Guid? LocationId { get; set; }
    public string? SpecificLocation { get; set; }
    public Guid? CustodianId { get; set; }
    public Guid? AccountingAccountId { get; set; }
    public string? Notes { get; set; }
}