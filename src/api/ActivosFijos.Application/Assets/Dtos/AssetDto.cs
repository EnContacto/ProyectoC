using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Application.Assets.Dtos;

public class AssetDto
{
    public Guid Id { get; set; }
    public string CurrentCode { get; set; } = string.Empty;
    public Guid CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;

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

    public AssetStatus Status { get; set; }
    public string StatusName => Status.ToString();

    public string? InvoiceNumber { get; set; }
    public string? Provider { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public int? AcquisitionYear { get; set; }

    public decimal? AcquisitionValue { get; set; }
    public decimal? PriorResidualValue { get; set; }
    public decimal? ResidualRate { get; set; }
    public decimal? DepreciableAmount { get; set; }

    public int? UsefulLifeYears { get; set; }
    public decimal? DepreciationRate { get; set; }
    public DateTime? DepreciationStartDate { get; set; }
    public DateTime? FinalDepreciationDate { get; set; }
    public int? TotalDaysToDepreciate { get; set; }

    public decimal? AccumulatedDepreciation { get; set; }
    public decimal? NetCost { get; set; }

    public Guid? LocationId { get; set; }
    public string? LocationName { get; set; }
    public string? SpecificLocation { get; set; }
    public Guid? CustodianId { get; set; }
    public string? CustodianName { get; set; }
    public Guid? AccountingAccountId { get; set; }
    public string? AccountingAccountCode { get; set; }

    public AssetClassification Classification { get; set; }
    public string ClassificationName => Classification.ToString();

    public AssetQualityFlag QualityFlag { get; set; }
    public string QualityFlagName => QualityFlag.ToString();

    public bool ManualReviewRequired { get; set; }
    public string? ManualReviewReason { get; set; }
    public bool MarkedAsReviewed { get; set; }
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}