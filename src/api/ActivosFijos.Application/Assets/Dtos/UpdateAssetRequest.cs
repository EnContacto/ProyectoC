using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Application.Assets.Dtos;

public class UpdateAssetRequest
{
    public string? Name { get; set; }
    public string? Detail { get; set; }
    public string? Brand { get; set; }
    public string? Model { get; set; }
    public string? Serial { get; set; }
    public string? Components { get; set; }
    public string? Capacity { get; set; }
    public string? Dimensions { get; set; }
    public string? Material { get; set; }
    public string? Color { get; set; }

    public AssetStatus? Status { get; set; }
    public string? InvoiceNumber { get; set; }
    public string? Provider { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public decimal? AcquisitionValue { get; set; }
    public decimal? PriorResidualValue { get; set; }
    public decimal? ResidualRate { get; set; }
    public int? UsefulLifeYears { get; set; }

    public Guid? LocationId { get; set; }
    public string? SpecificLocation { get; set; }
    public Guid? CustodianId { get; set; }
    public Guid? AccountingAccountId { get; set; }

    public AssetClassification? Classification { get; set; }
    public bool? MarkedAsReviewed { get; set; }
    public string? Notes { get; set; }
    public string? ManualReviewReason { get; set; }
}