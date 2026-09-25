using ActivosFijos.Application.Imports.Dtos;

namespace ActivosFijos.Application.Imports;

public interface IImportService
{
    Task<ImportResultDto> ImportAsync(Stream fileStream, string fileName, ImportOptions options, CancellationToken ct = default);
    Task<ImportResultDto?> GetBatchAsync(Guid batchId, CancellationToken ct = default);
    Task<IReadOnlyList<ImportResultDto>> ListBatchesAsync(CancellationToken ct = default);
    Task<bool> RevertAsync(Guid batchId, CancellationToken ct = default);
}