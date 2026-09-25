using ActivosFijos.Domain.Enums;

namespace ActivosFijos.Application.Assets.Dtos;

public class AssetFilterRequest
{
    public Guid? CompanyId { get; set; }
    public Guid? CategoryId { get; set; }
    public AssetStatus? Status { get; set; }
    public AssetClassification? Classification { get; set; }
    public AssetQualityFlag? QualityFlag { get; set; }
    public Guid? CustodianId { get; set; }
    public Guid? LocationId { get; set; }
    public int? AcquisitionYear { get; set; }
    public decimal? MinValue { get; set; }
    public decimal? MaxValue { get; set; }
    public string? Search { get; set; }
    public bool? ManualReviewOnly { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
    public string? SortBy { get; set; }
    public string? SortDirection { get; set; } = "asc";
}

public class PagedResult<T>
{
    public IReadOnlyList<T> Items { get; set; } = Array.Empty<T>();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}