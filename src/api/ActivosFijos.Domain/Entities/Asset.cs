using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Domain.Entities;

public class Asset
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CompanyId { get; set; }
    public Guid CategoryId { get; set; }

    public string CurrentCode { get; set; } = string.Empty;

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

    public AssetStatus Status { get; set; } = AssetStatus.Nd;

    public string? InvoiceNumber { get; set; }
    public string? Provider { get; set; }

    public DateTime? PurchaseDate { get; set; }
    public int? AcquisitionYear { get; set; }

    public decimal? AcquisitionValue { get; set; }
    public decimal? PriorResidualValue { get; set; }
    public decimal? ResidualRate { get; set; }
    public decimal? DepreciableAmount { get; set; }

    public int? PriorUsefulLifeYears { get; set; }
    public int? UsefulLifeYears { get; set; }
    public decimal? DepreciationRate { get; set; }
    public DateTime? DepreciationStartDate { get; set; }
    public DateTime? FinalDepreciationDate { get; set; }
    public int? TotalDaysToDepreciate { get; set; }

    public decimal? AccumulatedDepreciation { get; set; }
    public decimal? NetCost { get; set; }

    public Guid? LocationId { get; set; }
    public string? SpecificLocation { get; set; }
    public Guid? CustodianId { get; set; }
    public Guid? AccountingAccountId { get; set; }

    public AssetClassification Classification { get; set; } = AssetClassification.Activo;
    public AssetQualityFlag QualityFlag { get; set; } = AssetQualityFlag.Verde;

    public bool ManualReviewRequired { get; set; }
    public string? ManualReviewReason { get; set; }
    public bool MarkedAsReviewed { get; set; }
    public DateTime? ReviewedAt { get; set; }

    public string? Notes { get; set; }

    public Guid? ImportBatchId { get; set; }
    public string? ExternalRowReference { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Company Company { get; set; } = null!;
    public Category Category { get; set; } = null!;
    public Location? Location { get; set; }
    public Custodian? Custodian { get; set; }
    public AccountingAccount? AccountingAccount { get; set; }
    public ImportBatch? ImportBatch { get; set; }

    public ICollection<AssetEvent> Events { get; set; } = new List<AssetEvent>();
    public ICollection<AssetStatusHistory> StatusHistory { get; set; } = new List<AssetStatusHistory>();
    public ICollection<DepreciationSchedule> DepreciationSchedules { get; set; } = new List<DepreciationSchedule>();
}