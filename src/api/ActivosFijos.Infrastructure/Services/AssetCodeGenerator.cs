using ActivosFijos.Application.Assets;
using ActivosFijos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Infrastructure.Services;

public class AssetCodeGenerator : IAssetCodeGenerator
{
    private const int SequenceLength = 6;
    private readonly ActivosFijosDbContext _db;

    public AssetCodeGenerator(ActivosFijosDbContext db) => _db = db;

    public async Task<string> GenerateNextAsync(string companyShortName, string categoryShortCode, CancellationToken ct = default)
    {
        var prefix = $"{companyShortName}{categoryShortCode}";

        var lastCode = await _db.Assets
            .Where(a => a.CurrentCode.StartsWith(prefix))
            .OrderByDescending(a => a.CurrentCode)
            .Select(a => a.CurrentCode)
            .FirstOrDefaultAsync(ct);

        var next = 1;
        if (!string.IsNullOrEmpty(lastCode) && lastCode.Length >= prefix.Length + SequenceLength)
        {
            var sequencePart = lastCode.Substring(prefix.Length, SequenceLength);
            if (int.TryParse(sequencePart, out var parsed))
                next = parsed + 1;
        }

        return prefix + next.ToString(new string('0', SequenceLength));
    }

    public async Task<IReadOnlyList<string>> GenerateBatchAsync(string companyShortName, string categoryShortCode, int count, CancellationToken ct = default)
    {
        var prefix = $"{companyShortName}{categoryShortCode}";

        var lastCode = await _db.Assets
            .Where(a => a.CurrentCode.StartsWith(prefix))
            .OrderByDescending(a => a.CurrentCode)
            .Select(a => a.CurrentCode)
            .FirstOrDefaultAsync(ct);

        var start = 1;
        if (!string.IsNullOrEmpty(lastCode) && lastCode.Length >= prefix.Length + SequenceLength)
        {
            var sequencePart = lastCode.Substring(prefix.Length, SequenceLength);
            if (int.TryParse(sequencePart, out var parsed))
                start = parsed + 1;
        }

        var codes = new List<string>(count);
        for (var i = 0; i < count; i++)
            codes.Add(prefix + (start + i).ToString(new string('0', SequenceLength)));

        return codes;
    }
}