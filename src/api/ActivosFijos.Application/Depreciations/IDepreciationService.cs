using ActivosFijos.Application.Depreciations.Dtos;

namespace ActivosFijos.Application.Depreciations;

public interface IDepreciationService
{
    Task<DepreciationDto?> GetByAssetAsync(Guid assetId, CancellationToken ct = default);
    Task<ProjectionResponse> GetProjectionAsync(ProjectionRequest request, CancellationToken ct = default);
}