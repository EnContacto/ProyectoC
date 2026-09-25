namespace ActivosFijos.Application.Assets.Dtos;

public class AssetSummaryDto
{
    public int TotalCount { get; set; }
    public int ActivoCount { get; set; }
    public int InventarioCount { get; set; }
    public int ManualReviewCount { get; set; }
    public decimal TotalAcquisitionValue { get; set; }
    public decimal TotalAccumulatedDepreciation { get; set; }
    public decimal TotalNetCost { get; set; }
}
