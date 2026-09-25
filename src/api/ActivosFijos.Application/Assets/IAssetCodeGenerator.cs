namespace ActivosFijos.Application.Assets;

public interface IAssetCodeGenerator
{
    Task<string> GenerateNextAsync(string companyShortName, string categoryShortCode, CancellationToken ct = default);
    Task<IReadOnlyList<string>> GenerateBatchAsync(string companyShortName, string categoryShortCode, int count, CancellationToken ct = default);
}