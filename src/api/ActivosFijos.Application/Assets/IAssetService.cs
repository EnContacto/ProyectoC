using ActivosFijos.Application.Assets.Dtos;

namespace ActivosFijos.Application.Assets;

public interface IAssetService
{
    Task<PagedResult<AssetDto>> SearchAsync(AssetFilterRequest filter, CancellationToken ct = default);
    Task<AssetSummaryDto> GetSummaryAsync(AssetFilterRequest filter, CancellationToken ct = default);
    Task<AssetDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<AssetDto> CreateAsync(CreateAssetRequest request, CancellationToken ct = default);
    Task<AssetDto?> UpdateAsync(Guid id, UpdateAssetRequest request, CancellationToken ct = default);
    Task<BulkUpdateAssetsResult> BulkUpdateAsync(BulkUpdateAssetsRequest request, CancellationToken ct = default);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct = default);
    Task<int> RecalculateAllAsync(CancellationToken ct = default);
}
