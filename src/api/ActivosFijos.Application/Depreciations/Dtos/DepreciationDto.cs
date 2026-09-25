using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Application.Depreciations.Dtos;

public class DepreciationDto
{
    public Guid AssetId { get; set; }
    public string CurrentCode { get; set; } = string.Empty;
    public string AssetName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;

    public decimal? AcquisitionValue { get; set; }
    public decimal? ResidualRate { get; set; }
    public decimal? ResidualValue { get; set; }
    public decimal? DepreciableAmount { get; set; }
    public int? UsefulLifeYears { get; set; }

    public DateTime? DepreciationStartDate { get; set; }
    public DateTime? FinalDepreciationDate { get; set; }
    public int? TotalDaysToDepreciate { get; set; }
    public int? DaysPending { get; set; }
    public decimal? DailyRate { get; set; }

    public decimal AccumulatedDepreciation { get; set; }
    public decimal NetCost { get; set; }
    public decimal CurrentYearDepreciation { get; set; }
    public decimal NextYearDepreciation { get; set; }

    public AssetStatus Status { get; set; }
    public AssetQualityFlag QualityFlag { get; set; }
    public bool ManualReviewRequired { get; set; }
    public string? ManualReviewReason { get; set; }

    public List<MonthlyDepreciationDto> MonthlySchedule { get; set; } = new();
}

public class MonthlyDepreciationDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal AccumulatedDepreciation { get; set; }
    public decimal NetCost { get; set; }
}

public class ProjectionRequest
{
    public Guid? CompanyId { get; set; }
    public Guid? CategoryId { get; set; }
    public int? UntilYear { get; set; }
    public AssetStatus? Status { get; set; }
}

public class ProjectionResponse
{
    public int UntilYear { get; set; }
    public IReadOnlyList<ProjectionYearItem> Years { get; set; } = Array.Empty<ProjectionYearItem>();
    public decimal TotalProjectedDepreciation { get; set; }
    public decimal TotalNetCostAtEnd { get; set; }
    public int AssetCount { get; set; }
}

public class ProjectionYearItem
{
    public int Year { get; set; }
    public decimal Depreciation { get; set; }
    public decimal AccumulatedDepreciation { get; set; }
    public decimal NetCost { get; set; }
}