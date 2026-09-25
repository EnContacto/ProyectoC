using System.Globalization;
using System.Security.Cryptography;
using System.Text.Json;
using ActivosFijos.Application.Assets;
using ActivosFijos.Application.Imports;
using ActivosFijos.Application.Imports.Dtos;
using ActivosFijos.Domain.Entities;
using ActivosFijos.Domain.Enums;
using ActivosFijos.Infrastructure.Excel;
using ActivosFijos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Infrastructure.Services;

public class ImportService : IImportService
{
    private static readonly string[] ValidSheets =
    {
        "INSTALACIONES", "MUEBLES Y ENSERES", "MAQUINARIA Y EQUIPO",
        "EQUIPO DE COMPUTO", "VEHICULOS", "ADECUACIONES"
    };

    private static readonly Dictionary<string, string> SheetToCategoryCode = new(StringComparer.OrdinalIgnoreCase)
    {
        ["INSTALACIONES"] = "INST",
        ["MUEBLES Y ENSERES"] = "MUEN",
        ["MAQUINARIA Y EQUIPO"] = "MAEQ",
        ["EQUIPO DE COMPUTO"] = "EQCO",
        ["VEHICULOS"] = "VEHI",
        ["ADECUACIONES"] = "ADEC"
    };

    private readonly ActivosFijosDbContext _db;
    private readonly IExcelReader _reader;
    private readonly IAssetCodeGenerator _codeGenerator;

    public ImportService(ActivosFijosDbContext db, IExcelReader reader, IAssetCodeGenerator codeGenerator)
    {
        _db = db;
        _reader = reader;
        _codeGenerator = codeGenerator;
    }

    public async Task<ImportResultDto> ImportAsync(Stream fileStream, string fileName, ImportOptions options, CancellationToken ct = default)
    {
        var fileHash = ComputeHash(fileStream);
        fileStream.Position = 0;

        var batch = new ImportBatch
        {
            FileName = fileName,
            FileHash = fileHash,
            Status = ImportBatchStatus.Procesando,
            StartedAt = DateTime.UtcNow
        };
        _db.ImportBatches.Add(batch);
        await _db.SaveChangesAsync(ct);

        try
        {
            var sheets = _reader.Read(fileStream, ValidSheets);
            var allRows = new List<(string SheetName, ExcelRowData Row)>();
            foreach (var sheet in sheets)
                foreach (var row in sheet.Rows)
                    allRows.Add((sheet.SheetName, row));

            batch.TotalRows = allRows.Count;

            var pending = new List<PendingAsset>();
            foreach (var (sheetName, row) in allRows)
            {
                var parsed = ParseRow(sheetName, row, batch.Id);
                pending.Add(parsed);

                _db.ImportStaging.Add(new ImportStaging
                {
                    ImportBatchId = batch.Id,
                    RowNumber = row.RowNumber,
                    SheetName = sheetName,
                    RawJson = JsonSerializer.Serialize(row.Values),
                    NormalizedJson = parsed.Asset is null ? null : JsonSerializer.Serialize(parsed.Asset),
                    IsValid = parsed.IsValid,
                    IsDuplicate = parsed.IsDuplicate,
                    QualityFlag = parsed.QualityFlag
                });

                foreach (var error in parsed.Errors)
                {
                    _db.ImportErrors.Add(new ImportError
                    {
                        ImportBatchId = batch.Id,
                        RowNumber = row.RowNumber,
                        ColumnName = error.ColumnName,
                        Severity = error.Severity,
                        Message = error.Message,
                        RawValue = error.RawValue
                    });
                }
            }

            if (!options.DryRun)
            {
                await PersistAssetsAsync(pending, batch, options, ct);
            }

            batch.ProcessedRows = allRows.Count;
            batch.SuccessRows = pending.Count(p => p.IsValid && !p.IsDuplicate);
            batch.ErrorRows = pending.Count(p => !p.IsValid);
            batch.Status = batch.ErrorRows > 0
                ? ImportBatchStatus.CompletadoConErrores
                : ImportBatchStatus.Completado;
            batch.CompletedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync(ct);
        }
        catch (Exception ex)
        {
            batch.Status = ImportBatchStatus.Fallido;
            batch.ErrorMessage = ex.Message;
            batch.CompletedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync(ct);
            throw;
        }

        return await GetBatchAsync(batch.Id, ct) ?? throw new InvalidOperationException();
    }

    public async Task<ImportResultDto?> GetBatchAsync(Guid batchId, CancellationToken ct = default)
    {
        var batch = await _db.ImportBatches
            .Include(b => b.Errors)
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == batchId, ct);

        if (batch is null) return null;

        var duplicateCount = await _db.ImportStaging
            .Where(s => s.ImportBatchId == batchId && s.IsDuplicate)
            .CountAsync(ct);

        return new ImportResultDto
        {
            BatchId = batch.Id,
            FileName = batch.FileName,
            Status = batch.Status,
            TotalRows = batch.TotalRows,
            ProcessedRows = batch.ProcessedRows,
            SuccessRows = batch.SuccessRows,
            ErrorRows = batch.ErrorRows,
            DuplicateRows = duplicateCount,
            ErrorMessage = batch.ErrorMessage,
            StartedAt = batch.StartedAt,
            CompletedAt = batch.CompletedAt,
            Errors = batch.Errors.Select(e => new ImportErrorDto
            {
                Id = e.Id,
                RowNumber = e.RowNumber,
                ColumnName = e.ColumnName,
                Severity = e.Severity,
                Message = e.Message,
                RawValue = e.RawValue
            }).ToList()
        };
    }

    public async Task<IReadOnlyList<ImportResultDto>> ListBatchesAsync(CancellationToken ct = default)
    {
        var batches = await _db.ImportBatches
            .AsNoTracking()
            .OrderByDescending(b => b.StartedAt)
            .Take(100)
            .ToListAsync(ct);

        return batches.Select(b => new ImportResultDto
        {
            BatchId = b.Id,
            FileName = b.FileName,
            Status = b.Status,
            TotalRows = b.TotalRows,
            ProcessedRows = b.ProcessedRows,
            SuccessRows = b.SuccessRows,
            ErrorRows = b.ErrorRows,
            ErrorMessage = b.ErrorMessage,
            StartedAt = b.StartedAt,
            CompletedAt = b.CompletedAt
        }).ToList();
    }

    public async Task<bool> RevertAsync(Guid batchId, CancellationToken ct = default)
    {
        var batch = await _db.ImportBatches.FirstOrDefaultAsync(b => b.Id == batchId, ct);
        if (batch is null) return false;
        if (batch.Status == ImportBatchStatus.Revertido) return false;

        var assets = await _db.Assets.Where(a => a.ImportBatchId == batchId).ToListAsync(ct);
        _db.Assets.RemoveRange(assets);

        batch.Status = ImportBatchStatus.Revertido;
        batch.CompletedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);
        return true;
    }

    private async Task PersistAssetsAsync(
        List<PendingAsset> pending,
        ImportBatch batch,
        ImportOptions options,
        CancellationToken ct)
    {
        var companies = await _db.Companies.ToDictionaryAsync(c => c.ShortName, c => c, StringComparer.OrdinalIgnoreCase, ct);
        var categories = await _db.Categories.ToDictionaryAsync(c => c.ShortCode, c => c, StringComparer.OrdinalIgnoreCase, ct);

        var valid = pending
            .Where(p => p.IsValid && p.Asset is not null)
            .Where(p => !options.SkipDuplicates || !p.IsDuplicate)
            .ToList();

        var groups = valid
            .GroupBy(p => new
            {
                p.Asset!.CompanyId,
                p.Asset.CategoryId
            });

        await using var tx = await _db.Database.BeginTransactionAsync(ct);

        foreach (var group in groups)
        {
            var company = companies.Values.First(c => c.Id == group.Key.CompanyId);
            var category = categories.Values.First(c => c.Id == group.Key.CategoryId);

            var ordered = group
                .OrderBy(p => p.Asset!.PurchaseDate ?? DateTime.MaxValue)
                .ThenBy(p => p.Asset!.Name)
                .ToList();

            var codes = await _codeGenerator.GenerateBatchAsync(company.ShortName, category.ShortCode, ordered.Count, ct);

            for (var i = 0; i < ordered.Count; i++)
            {
                ordered[i].Asset!.CurrentCode = codes[i];
                ordered[i].Asset!.ImportBatchId = batch.Id;
                _db.Assets.Add(ordered[i].Asset!);
            }
        }

        await _db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
    }

    private PendingAsset ParseRow(string sheetName, ExcelRowData row, Guid batchId)
    {
        var errors = new List<PendingError>();
        var result = new PendingAsset();

        if (!SheetToCategoryCode.TryGetValue(sheetName, out var categoryCode))
        {
            result.IsValid = false;
            result.Errors.Add(new PendingError
            {
                Severity = ImportErrorSeverity.Critico,
                Message = $"Hoja '{sheetName}' no reconocida."
            });
            return result;
        }

        var companyName = GetString(row, "empresa");
        var asset = new Asset();
        var shortName = companyName is null ? null : MapCompanyShortName(companyName);
        var company = shortName is null ? null : _db.Companies
            .AsNoTracking()
            .FirstOrDefault(c => c.ShortName == shortName && c.IsActive);

        if (company is null)
        {
            errors.Add(new PendingError
            {
                Severity = ImportErrorSeverity.Critico,
                ColumnName = "empresa",
                Message = companyName is null ? "Empresa vacía." : $"Empresa '{companyName}' no encontrada.",
                RawValue = companyName
            });
        }
        else
            asset.CompanyId = company.Id;

        var category = _db.Categories
            .AsNoTracking()
            .FirstOrDefault(c => c.ShortCode == categoryCode);

        if (category is null)
        {
            result.IsValid = false;
            result.Errors.Add(new PendingError
            {
                Severity = ImportErrorSeverity.Critico,
                Message = $"Categoría '{categoryCode}' no encontrada."
            });
            return result;
        }

        asset.CategoryId = category.Id;
        asset.Name = GetString(row, "nombre del activo") ?? string.Empty;
        asset.Detail = GetString(row, "detalle del bien");
        asset.Brand = GetString(row, "marca");
        asset.Model = GetString(row, "modelo");
        asset.Serial = GetString(row, "serie");
        asset.Components = GetString(row, "componentes");
        asset.Capacity = GetString(row, "capacidad");
        asset.Dimensions = GetString(row, "dimensiones");
        asset.Material = GetString(row, "material");
        asset.Color = GetString(row, "color");
        asset.InvoiceNumber = GetString(row, "no. factura");
        asset.Provider = GetString(row, "proveedor");
        asset.SpecificLocation = GetString(row, "ubicacion especifica / departamento laboral");

        asset.PurchaseDate = ParseDate(GetString(row, "fecha de adquisicion"));
        asset.AcquisitionYear = asset.PurchaseDate?.Year
            ?? ParseInt(GetString(row, "año de adquisicion"));

        asset.AcquisitionValue = ParseDecimal(GetString(row, "valor de adquisicion (usd)"));
        asset.PriorResidualValue = ParseDecimal(GetString(row, "valor residual anterior"));
        asset.UsefulLifeYears = ParseInt(GetString(row, "vida util anterior")) ?? category.DefaultUsefulLifeYears;
        asset.ResidualRate = category.DefaultResidualRate;
        asset.Status = ParseStatus(GetString(row, "estado"));

        if (string.IsNullOrWhiteSpace(asset.Name))
            errors.Add(new PendingError { Severity = ImportErrorSeverity.Error, ColumnName = "nombre del activo", Message = "Nombre del activo vacío." });

        if (!asset.PurchaseDate.HasValue)
            errors.Add(new PendingError { Severity = ImportErrorSeverity.Critico, ColumnName = "fecha de adquisicion", Message = "Fecha de adquisición vacía o inválida." });

        if (!asset.AcquisitionValue.HasValue || asset.AcquisitionValue <= 0)
            errors.Add(new PendingError { Severity = ImportErrorSeverity.Critico, ColumnName = "valor de adquisicion (usd)", Message = "Valor de adquisición vacío o inválido." });

        if (!asset.UsefulLifeYears.HasValue || asset.UsefulLifeYears <= 0)
            errors.Add(new PendingError { Severity = ImportErrorSeverity.Critico, ColumnName = "vida util anterior", Message = "Vida útil vacía o inválida." });

        if (!asset.ResidualRate.HasValue)
            errors.Add(new PendingError { Severity = ImportErrorSeverity.Critico, ColumnName = "valor residual", Message = "Valor residual vacío." });

        result.Asset = asset;
        result.Errors = errors;

        var criticalErrors = errors.Any(e => e.Severity == ImportErrorSeverity.Critico);
        result.IsValid = !criticalErrors;

        if (criticalErrors)
            result.QualityFlag = AssetQualityFlag.Naranja;
        else if (errors.Count > 0)
            result.QualityFlag = AssetQualityFlag.Amarillo;
        else
            result.QualityFlag = AssetQualityFlag.Verde;

        if (asset.AcquisitionValue.HasValue)
        {
            if (asset.AcquisitionValue.Value <= 500m && (asset.PriorResidualValue ?? 0) == 0)
                result.QualityFlag = AssetQualityFlag.Azul;
        }

        if (result.IsValid && result.Asset is not null)
        {
            var a = result.Asset;
            var exists = _db.Assets.Any(x =>
                x.InvoiceNumber == a.InvoiceNumber
                && x.Provider == a.Provider
                && x.Serial == a.Serial
                && a.InvoiceNumber != null
                && a.Serial != null);

            if (exists)
            {
                result.IsDuplicate = true;
                result.Errors.Add(new PendingError
                {
                    Severity = ImportErrorSeverity.Advertencia,
                    Message = "Activo duplicado por factura + proveedor + serie."
                });
            }
        }

        return result;
    }

    private static string? MapCompanyShortName(string name)
    {
        var n = name.Trim().ToUpperInvariant();
        if (n.Contains("NOVACARGO")) return "NOV";
        if (n.Contains("IMPEX")) return "IMP";
        if (n.Contains("SERVIPALLET")) return "SER";
        return null;
    }

    private static string? GetString(ExcelRowData row, string key)
    {
        if (!row.Values.TryGetValue(key, out var v)) return null;
        return string.IsNullOrWhiteSpace(v) ? null : v.Trim();
    }

    private static DateTime? ParseDate(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;
        var formats = new[]
        {
            "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy",
            "yyyy/MM/dd", "d/M/yyyy", "M/d/yyyy"
        };
        foreach (var f in formats)
            if (DateTime.TryParseExact(raw, f, CultureInfo.InvariantCulture, DateTimeStyles.None, out var d))
                return d;
        return DateTime.TryParse(raw, CultureInfo.InvariantCulture, DateTimeStyles.None, out var fallback)
            ? fallback : null;
    }

    private static int? ParseInt(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;
        if (decimal.TryParse(raw.Replace(",", "."), NumberStyles.Any, CultureInfo.InvariantCulture, out var d))
            return (int)Math.Round(d);
        return null;
    }

    private static decimal? ParseDecimal(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return null;
        var cleaned = raw.Replace("$", "").Replace("USD", "").Trim();
        if (cleaned.Contains(",") && cleaned.Contains("."))
            cleaned = cleaned.Replace(",", "");
        else if (cleaned.Contains(","))
            cleaned = cleaned.Replace(",", ".");
        return decimal.TryParse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture, out var d)
            ? d : null;
    }

    private static AssetStatus ParseStatus(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return AssetStatus.Nd;
        var n = raw.Trim().ToUpperInvariant();
        return n switch
        {
            "BUENO" => AssetStatus.Bueno,
            "REGULAR" => AssetStatus.Regular,
            "MALO" => AssetStatus.Malo,
            "DAR DE BAJA" => AssetStatus.DarDeBaja,
            "FALTANTE" => AssetStatus.Faltante,
            "CAMBIO DE SERIE" => AssetStatus.CambioDeSerie,
            "VENDIDO" => AssetStatus.Vendido,
            _ => AssetStatus.Nd
        };
    }

    private static string ComputeHash(Stream stream)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(stream);
        return Convert.ToHexString(bytes);
    }

    private class PendingAsset
    {
        public Asset? Asset { get; set; }
        public bool IsValid { get; set; }
        public bool IsDuplicate { get; set; }
        public AssetQualityFlag? QualityFlag { get; set; }
        public List<PendingError> Errors { get; set; } = new();
    }

    private class PendingError
    {
        public string? ColumnName { get; set; }
        public ImportErrorSeverity Severity { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? RawValue { get; set; }
    }
}
