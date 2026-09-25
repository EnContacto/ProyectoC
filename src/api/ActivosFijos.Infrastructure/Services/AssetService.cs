using ActivosFijos.Application.Assets;
using ActivosFijos.Application.Assets.Dtos;
using ActivosFijos.Domain.Entities;
using ActivosFijos.Domain.Enums;
using ActivosFijos.Domain.Services;
using ActivosFijos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Infrastructure.Services;

public class AssetService : IAssetService
{
    private readonly ActivosFijosDbContext _db;
    private readonly IAssetCodeGenerator _codeGenerator;

    public AssetService(ActivosFijosDbContext db, IAssetCodeGenerator codeGenerator)
    {
        _db = db;
        _codeGenerator = codeGenerator;
    }

    public async Task<PagedResult<AssetDto>> SearchAsync(AssetFilterRequest filter, CancellationToken ct = default)
    {
        var q = BuildQuery(filter);
        var total = await q.CountAsync(ct);

        var items = await q
            .OrderBy(a => a.CurrentCode)
            .Skip((filter.Page - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(a => Map(a))
            .ToListAsync(ct);

        return new PagedResult<AssetDto>
        {
            Items = items,
            TotalCount = total,
            Page = filter.Page,
            PageSize = filter.PageSize
        };
    }

    public async Task<AssetSummaryDto> GetSummaryAsync(AssetFilterRequest filter, CancellationToken ct = default)
        => await BuildQuery(filter)
            .GroupBy(a => 1)
            .Select(g => new AssetSummaryDto
            {
                TotalCount = g.Count(),
                ActivoCount = g.Count(a => a.Classification == AssetClassification.Activo),
                InventarioCount = g.Count(a => a.Classification == AssetClassification.Inventario),
                ManualReviewCount = g.Count(a => a.ManualReviewRequired),
                TotalAcquisitionValue = g.Sum(a => a.AcquisitionValue ?? 0m),
                TotalAccumulatedDepreciation = g.Sum(a => a.AccumulatedDepreciation ?? 0m),
                TotalNetCost = g.Sum(a => a.NetCost ?? 0m)
            })
            .FirstOrDefaultAsync(ct) ?? new AssetSummaryDto();

    public async Task<AssetDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var asset = await BaseQuery().FirstOrDefaultAsync(a => a.Id == id, ct);
        return asset is null ? null : Map(asset);
    }

    public async Task<AssetDto> CreateAsync(CreateAssetRequest request, CancellationToken ct = default)
    {
        var company = await _db.Companies.FindAsync(new object[] { request.CompanyId }, ct)
            ?? throw new InvalidOperationException("Empresa no encontrada.");
        var category = await _db.Categories.FindAsync(new object[] { request.CategoryId }, ct)
            ?? throw new InvalidOperationException("Categoría no encontrada.");

        var asset = new Asset
        {
            CompanyId = request.CompanyId,
            CategoryId = request.CategoryId,
            Name = request.Name,
            Detail = request.Detail,
            Brand = request.Brand,
            Model = request.Model,
            Serial = request.Serial,
            Components = request.Components,
            Capacity = request.Capacity,
            Dimensions = request.Dimensions,
            Material = request.Material,
            Color = request.Color,
            Status = request.Status,
            InvoiceNumber = request.InvoiceNumber,
            Provider = request.Provider,
            PurchaseDate = request.PurchaseDate,
            AcquisitionYear = request.PurchaseDate?.Year,
            AcquisitionValue = request.AcquisitionValue,
            UsefulLifeYears = request.UsefulLifeYears ?? category.DefaultUsefulLifeYears,
            ResidualRate = request.ResidualRate ?? category.DefaultResidualRate,
            LocationId = request.LocationId,
            SpecificLocation = request.SpecificLocation,
            CustodianId = request.CustodianId,
            AccountingAccountId = request.AccountingAccountId,
            Notes = request.Notes
        };

        asset.CurrentCode = await _codeGenerator.GenerateNextAsync(company.ShortName, category.ShortCode, ct);

        Recalculate(asset, category);

        _db.Assets.Add(asset);
        await _db.SaveChangesAsync(ct);

        return Map(asset, company.Name, category.Name);
    }

    public async Task<AssetDto?> UpdateAsync(Guid id, UpdateAssetRequest request, CancellationToken ct = default)
    {
        var asset = await BaseQuery().FirstOrDefaultAsync(a => a.Id == id, ct);
        if (asset is null) return null;

        var previousStatus = asset.Status;

        if (request.Name is not null) asset.Name = request.Name;
        if (request.Detail is not null) asset.Detail = request.Detail;
        if (request.Brand is not null) asset.Brand = request.Brand;
        if (request.Model is not null) asset.Model = request.Model;
        if (request.Serial is not null) asset.Serial = request.Serial;
        if (request.Components is not null) asset.Components = request.Components;
        if (request.Capacity is not null) asset.Capacity = request.Capacity;
        if (request.Dimensions is not null) asset.Dimensions = request.Dimensions;
        if (request.Material is not null) asset.Material = request.Material;
        if (request.Color is not null) asset.Color = request.Color;
        if (request.InvoiceNumber is not null) asset.InvoiceNumber = request.InvoiceNumber;
        if (request.Provider is not null) asset.Provider = request.Provider;
        if (request.PurchaseDate.HasValue)
        {
            asset.PurchaseDate = request.PurchaseDate;
            asset.AcquisitionYear = request.PurchaseDate.Value.Year;
        }
        if (request.AcquisitionValue.HasValue) asset.AcquisitionValue = request.AcquisitionValue;
        if (request.PriorResidualValue.HasValue) asset.PriorResidualValue = request.PriorResidualValue;
        if (request.ResidualRate.HasValue) asset.ResidualRate = request.ResidualRate;
        if (request.UsefulLifeYears.HasValue) asset.UsefulLifeYears = request.UsefulLifeYears;
        if (request.LocationId.HasValue) asset.LocationId = request.LocationId;
        if (request.SpecificLocation is not null) asset.SpecificLocation = request.SpecificLocation;
        if (request.CustodianId.HasValue) asset.CustodianId = request.CustodianId;
        if (request.AccountingAccountId.HasValue) asset.AccountingAccountId = request.AccountingAccountId;
        if (request.Classification.HasValue) asset.Classification = request.Classification.Value;
        if (request.MarkedAsReviewed.HasValue)
        {
            asset.MarkedAsReviewed = request.MarkedAsReviewed.Value;
            asset.ReviewedAt = DateTime.UtcNow;
        }
        if (request.Notes is not null) asset.Notes = request.Notes;
        if (request.ManualReviewReason is not null) asset.ManualReviewReason = request.ManualReviewReason;

        if (request.Status.HasValue && request.Status.Value != previousStatus)
        {
            asset.Status = request.Status.Value;
            _db.AssetStatusHistories.Add(new AssetStatusHistory
            {
                AssetId = asset.Id,
                PreviousStatus = previousStatus,
                NewStatus = request.Status.Value,
                Reason = request.ManualReviewReason
            });
        }

        asset.UpdatedAt = DateTime.UtcNow;

        var category = await _db.Categories.FindAsync(new object[] { asset.CategoryId }, ct)!;
        Recalculate(asset, category!);

        await _db.SaveChangesAsync(ct);

        return Map(asset);
    }

    public async Task<BulkUpdateAssetsResult> BulkUpdateAsync(BulkUpdateAssetsRequest request, CancellationToken ct = default)
    {
        var fields = request.Fields;
        if (fields.CompanyId.HasValue &&
            !await _db.Companies.AnyAsync(x => x.Id == fields.CompanyId.Value && x.IsActive, ct))
            throw new ArgumentException("Empresa no encontrada.");
        if (fields.CategoryId.HasValue &&
            !await _db.Categories.AnyAsync(x => x.Id == fields.CategoryId.Value && x.IsActive, ct))
            throw new ArgumentException("Categoría no encontrada.");
        if (fields.LocationId.HasValue &&
            !await _db.Locations.AnyAsync(x => x.Id == fields.LocationId.Value && x.IsActive, ct))
            throw new ArgumentException("Ubicación no encontrada.");
        if (fields.AccountingAccountId.HasValue &&
            !await _db.AccountingAccounts.AnyAsync(x => x.Id == fields.AccountingAccountId.Value && x.IsActive, ct))
            throw new ArgumentException("Cuenta contable no encontrada.");

        var ids = request.Ids.Distinct().ToList();
        await using var tx = await _db.Database.BeginTransactionAsync(ct);
        var assets = await _db.Assets.Where(a => ids.Contains(a.Id)).ToListAsync(ct);
        var found = assets.Select(a => a.Id).ToHashSet();
        var result = new BulkUpdateAssetsResult
        {
            Updated = assets.Count,
            Failed = ids.Where(id => !found.Contains(id)).ToList()
        };

        var changedCodes = assets
            .Where(a => (fields.CompanyId.HasValue && a.CompanyId != fields.CompanyId.Value) ||
                        (fields.CategoryId.HasValue && a.CategoryId != fields.CategoryId.Value))
            .GroupBy(a => new
            {
                CompanyId = fields.CompanyId ?? a.CompanyId,
                CategoryId = fields.CategoryId ?? a.CategoryId
            });

        foreach (var group in changedCodes)
        {
            var company = await _db.Companies.FindAsync(new object[] { group.Key.CompanyId }, ct)
                ?? throw new InvalidOperationException("Empresa no encontrada.");
            var category = await _db.Categories.FindAsync(new object[] { group.Key.CategoryId }, ct)
                ?? throw new InvalidOperationException("Categoría no encontrada.");
            var members = group.OrderBy(a => a.CurrentCode).ToList();
            var codes = await _codeGenerator.GenerateBatchAsync(company.ShortName, category.ShortCode, members.Count, ct);
            for (var i = 0; i < members.Count; i++)
                members[i].CurrentCode = codes[i];
        }

        var now = DateTime.UtcNow;
        foreach (var asset in assets)
        {
            if (fields.CompanyId.HasValue) asset.CompanyId = fields.CompanyId.Value;
            if (fields.CategoryId.HasValue) asset.CategoryId = fields.CategoryId.Value;
            if (fields.LocationId.HasValue) asset.LocationId = fields.LocationId.Value;
            if (fields.AccountingAccountId.HasValue) asset.AccountingAccountId = fields.AccountingAccountId.Value;
            asset.UpdatedAt = now;
        }

        await _db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return result;
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var asset = await _db.Assets.FirstOrDefaultAsync(a => a.Id == id, ct);
        if (asset is null) return false;

        _db.Assets.Remove(asset);
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<int> RecalculateAllAsync(CancellationToken ct = default)
    {
        var assets = await BaseQuery().ToListAsync(ct);
        var categories = await _db.Categories.ToDictionaryAsync(c => c.Id, ct);

        foreach (var asset in assets)
        {
            if (categories.TryGetValue(asset.CategoryId, out var cat))
                Recalculate(asset, cat);
        }

        await _db.SaveChangesAsync(ct);
        return assets.Count;
    }

    private static void Recalculate(Asset asset, Category category)
    {
        asset.QualityFlag = AssetQualityFlag.Verde;
        asset.ManualReviewRequired = false;
        asset.ManualReviewReason = null;

        var missingCritical = new List<string>();
        if (!asset.PurchaseDate.HasValue) missingCritical.Add("fecha de adquisición");
        if (!asset.AcquisitionValue.HasValue) missingCritical.Add("valor de adquisición");
        if (!asset.UsefulLifeYears.HasValue) missingCritical.Add("vida útil");
        if (!asset.ResidualRate.HasValue) missingCritical.Add("valor residual");

        if (missingCritical.Count > 0)
        {
            asset.QualityFlag = AssetQualityFlag.Naranja;
            asset.ManualReviewRequired = true;
            asset.ManualReviewReason = $"Campos críticos faltantes: {string.Join(", ", missingCritical)}";
            return;
        }

        if (asset.ResidualRate!.Value * asset.AcquisitionValue!.Value > asset.AcquisitionValue.Value)
        {
            asset.QualityFlag = AssetQualityFlag.Rojo;
            asset.ManualReviewRequired = true;
            asset.ManualReviewReason = "Valor residual mayor al valor de adquisición.";
            return;
        }

        var result = DepreciationCalculator.Calculate(new DepreciationInput
        {
            AcquisitionValue = asset.AcquisitionValue!.Value,
            ResidualRate = asset.ResidualRate!.Value,
            PurchaseDate = asset.PurchaseDate!.Value,
            UsefulLifeYears = asset.UsefulLifeYears!.Value
        });

        asset.DepreciableAmount = result.DepreciableAmount;
        asset.DepreciationStartDate = result.DepreciationStartDate;
        asset.FinalDepreciationDate = result.FinalDepreciationDate;
        asset.TotalDaysToDepreciate = result.TotalDaysToDepreciate;
        asset.DepreciationRate = asset.AcquisitionValue.Value > 0
            ? Math.Round(result.DepreciableAmount / asset.AcquisitionValue.Value / asset.UsefulLifeYears!.Value, 6)
            : 0;

        var today = DateTime.UtcNow.Date;
        asset.AccumulatedDepreciation = result.GetAccumulatedAt(today);
        asset.NetCost = asset.AcquisitionValue.Value - asset.AccumulatedDepreciation.Value;

        var threshold = 500m;
        var hasDepreciation = asset.AccumulatedDepreciation > 0 || asset.PriorResidualValue > 0;
        if (asset.AcquisitionValue.Value > threshold || hasDepreciation)
        {
            asset.Classification = AssetClassification.Activo;
            if (asset.AcquisitionValue.Value <= threshold)
                asset.QualityFlag = AssetQualityFlag.Azul;
        }
        else
        {
            asset.Classification = AssetClassification.Inventario;
        }
    }

    private IQueryable<Asset> BuildQuery(AssetFilterRequest filter)
    {
        var q = BaseQuery();
        if (filter.CompanyId.HasValue) q = q.Where(a => a.CompanyId == filter.CompanyId);
        if (filter.CategoryId.HasValue) q = q.Where(a => a.CategoryId == filter.CategoryId);
        if (filter.Status.HasValue) q = q.Where(a => a.Status == filter.Status);
        if (filter.Classification.HasValue) q = q.Where(a => a.Classification == filter.Classification);
        if (filter.QualityFlag.HasValue) q = q.Where(a => a.QualityFlag == filter.QualityFlag);
        if (filter.CustodianId.HasValue) q = q.Where(a => a.CustodianId == filter.CustodianId);
        if (filter.LocationId.HasValue) q = q.Where(a => a.LocationId == filter.LocationId);
        if (filter.AcquisitionYear.HasValue) q = q.Where(a => a.AcquisitionYear == filter.AcquisitionYear);
        if (filter.MinValue.HasValue) q = q.Where(a => a.AcquisitionValue >= filter.MinValue);
        if (filter.MaxValue.HasValue) q = q.Where(a => a.AcquisitionValue <= filter.MaxValue);
        if (filter.ManualReviewOnly == true) q = q.Where(a => a.ManualReviewRequired);
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var s = filter.Search.Trim();
            q = q.Where(a =>
                a.CurrentCode.Contains(s) ||
                a.Name.Contains(s) ||
                (a.Serial != null && a.Serial.Contains(s)) ||
                (a.InvoiceNumber != null && a.InvoiceNumber.Contains(s)) ||
                (a.Provider != null && a.Provider.Contains(s)));
        }
        return q;
    }

    private IQueryable<Asset> BaseQuery()
        => _db.Assets
            .Include(a => a.Company)
            .Include(a => a.Category)
            .Include(a => a.Location)
            .Include(a => a.Custodian)
            .Include(a => a.AccountingAccount)
            .AsNoTracking();

    private static AssetDto Map(Asset a) => Map(a, a.Company?.Name ?? "", a.Category?.Name ?? "");

    private static AssetDto Map(Asset a, string companyName, string categoryName) => new()
    {
        Id = a.Id,
        CurrentCode = a.CurrentCode,
        CompanyId = a.CompanyId,
        CompanyName = companyName,
        CategoryId = a.CategoryId,
        CategoryName = categoryName,
        Name = a.Name,
        Detail = a.Detail,
        Brand = a.Brand,
        Model = a.Model,
        Serial = a.Serial,
        Components = a.Components,
        Capacity = a.Capacity,
        Dimensions = a.Dimensions,
        Material = a.Material,
        Color = a.Color,
        Status = a.Status,
        InvoiceNumber = a.InvoiceNumber,
        Provider = a.Provider,
        PurchaseDate = a.PurchaseDate,
        AcquisitionYear = a.AcquisitionYear,
        AcquisitionValue = a.AcquisitionValue,
        PriorResidualValue = a.PriorResidualValue,
        ResidualRate = a.ResidualRate,
        DepreciableAmount = a.DepreciableAmount,
        UsefulLifeYears = a.UsefulLifeYears,
        DepreciationRate = a.DepreciationRate,
        DepreciationStartDate = a.DepreciationStartDate,
        FinalDepreciationDate = a.FinalDepreciationDate,
        TotalDaysToDepreciate = a.TotalDaysToDepreciate,
        AccumulatedDepreciation = a.AccumulatedDepreciation,
        NetCost = a.NetCost,
        LocationId = a.LocationId,
        LocationName = a.Location?.Name,
        SpecificLocation = a.SpecificLocation,
        CustodianId = a.CustodianId,
        CustodianName = a.Custodian?.Name,
        AccountingAccountId = a.AccountingAccountId,
        AccountingAccountCode = a.AccountingAccount?.Code,
        Classification = a.Classification,
        QualityFlag = a.QualityFlag,
        ManualReviewRequired = a.ManualReviewRequired,
        ManualReviewReason = a.ManualReviewReason,
        MarkedAsReviewed = a.MarkedAsReviewed,
        Notes = a.Notes,
        CreatedAt = a.CreatedAt,
        UpdatedAt = a.UpdatedAt
    };
}
