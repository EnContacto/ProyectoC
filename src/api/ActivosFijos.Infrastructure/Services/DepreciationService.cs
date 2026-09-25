using ActivosFijos.Application.Depreciations;
using ActivosFijos.Application.Depreciations.Dtos;
using ActivosFijos.Domain.Enums;
using ActivosFijos.Domain.Services;
using ActivosFijos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Infrastructure.Services;

public class DepreciationService : IDepreciationService
{
    private readonly ActivosFijosDbContext _db;

    public DepreciationService(ActivosFijosDbContext db) => _db = db;

    public async Task<DepreciationDto?> GetByAssetAsync(Guid assetId, CancellationToken ct = default)
    {
        var asset = await _db.Assets
            .Include(a => a.Company)
            .Include(a => a.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == assetId, ct);

        if (asset is null) return null;
        if (!CanCalculate(asset))
            return BuildUncalculable(asset);

        var result = DepreciationCalculator.Calculate(new DepreciationInput
        {
            AcquisitionValue = asset.AcquisitionValue!.Value,
            ResidualRate = asset.ResidualRate!.Value,
            PurchaseDate = asset.PurchaseDate!.Value,
            UsefulLifeYears = asset.UsefulLifeYears!.Value
        });

        var today = DateTime.UtcNow.Date;
        return new DepreciationDto
        {
            AssetId = asset.Id,
            CurrentCode = asset.CurrentCode,
            AssetName = asset.Name,
            CompanyName = asset.Company?.Name ?? "",
            CategoryName = asset.Category?.Name ?? "",
            AcquisitionValue = asset.AcquisitionValue,
            ResidualRate = asset.ResidualRate,
            ResidualValue = result.ResidualValue,
            DepreciableAmount = result.DepreciableAmount,
            UsefulLifeYears = asset.UsefulLifeYears,
            DepreciationStartDate = result.DepreciationStartDate,
            FinalDepreciationDate = result.FinalDepreciationDate,
            TotalDaysToDepreciate = result.TotalDaysToDepreciate,
            DaysPending = Math.Max(0, result.TotalDaysToDepreciate - (today - result.DepreciationStartDate).Days),
            DailyRate = result.DailyRate,
            AccumulatedDepreciation = result.GetAccumulatedAt(today),
            NetCost = result.GetNetCostAt(today),
            CurrentYearDepreciation = result.GetDepreciationForYear(today.Year),
            NextYearDepreciation = result.GetDepreciationForYear(today.Year + 1),
            Status = asset.Status,
            QualityFlag = asset.QualityFlag,
            ManualReviewRequired = asset.ManualReviewRequired,
            ManualReviewReason = asset.ManualReviewReason,
            MonthlySchedule = result.MonthlySchedule.Select(m => new MonthlyDepreciationDto
            {
                Year = m.Year,
                Month = m.Month,
                DepreciationAmount = m.DepreciationAmount,
                AccumulatedDepreciation = m.AccumulatedDepreciation,
                NetCost = m.NetCost
            }).ToList()
        };
    }

    public async Task<ProjectionResponse> GetProjectionAsync(ProjectionRequest request, CancellationToken ct = default)
    {
        var untilYear = request.UntilYear ?? 2030;
        var today = DateTime.UtcNow.Date;

        var query = _db.Assets
            .Include(a => a.Company)
            .Include(a => a.Category)
            .Where(a => a.AcquisitionValue != null
                     && a.ResidualRate != null
                     && a.PurchaseDate != null
                     && a.UsefulLifeYears != null
                     && a.Classification == AssetClassification.Activo);

        if (request.CompanyId.HasValue) query = query.Where(a => a.CompanyId == request.CompanyId);
        if (request.CategoryId.HasValue) query = query.Where(a => a.CategoryId == request.CategoryId);
        if (request.Status.HasValue) query = query.Where(a => a.Status == request.Status);

        var assets = await query.AsNoTracking().ToListAsync(ct);

        var yearItems = new Dictionary<int, ProjectionYearItem>();
        var totalProjected = 0m;
        var totalNetCostAtEnd = 0m;

        foreach (var asset in assets)
        {
            var result = DepreciationCalculator.Calculate(new DepreciationInput
            {
                AcquisitionValue = asset.AcquisitionValue!.Value,
                ResidualRate = asset.ResidualRate!.Value,
                PurchaseDate = asset.PurchaseDate!.Value,
                UsefulLifeYears = asset.UsefulLifeYears!.Value
            });

            foreach (var m in result.MonthlySchedule.Where(m => m.Year >= today.Year && m.Year <= untilYear))
            {
                if (!yearItems.TryGetValue(m.Year, out var item))
                {
                    item = new ProjectionYearItem { Year = m.Year };
                    yearItems[m.Year] = item;
                }
                item.Depreciation += m.DepreciationAmount;
                item.AccumulatedDepreciation += m.DepreciationAmount;
                totalProjected += m.DepreciationAmount;
            }

            totalNetCostAtEnd += result.GetNetCostAt(new DateTime(untilYear, 12, 31));
        }

        var ordered = yearItems.Values.OrderBy(v => v.Year).ToList();
        var runningAccum = assets.Sum(a => a.AccumulatedDepreciation ?? 0);
        var originalValue = assets.Sum(a => a.AcquisitionValue ?? 0);

        foreach (var item in ordered)
        {
            runningAccum += item.Depreciation;
            item.AccumulatedDepreciation = Math.Round(runningAccum, 2);
            item.NetCost = Math.Round(originalValue - runningAccum, 2);
        }

        return new ProjectionResponse
        {
            UntilYear = untilYear,
            Years = ordered,
            TotalProjectedDepreciation = Math.Round(totalProjected, 2),
            TotalNetCostAtEnd = Math.Round(totalNetCostAtEnd, 2),
            AssetCount = assets.Count
        };
    }

    private static bool CanCalculate(Domain.Entities.Asset a)
        => a.AcquisitionValue.HasValue
        && a.ResidualRate.HasValue
        && a.PurchaseDate.HasValue
        && a.UsefulLifeYears.HasValue
        && a.AcquisitionValue.Value > 0
        && a.UsefulLifeYears.Value > 0;

    private static DepreciationDto BuildUncalculable(Domain.Entities.Asset asset)
        => new()
        {
            AssetId = asset.Id,
            CurrentCode = asset.CurrentCode,
            AssetName = asset.Name,
            CompanyName = asset.Company?.Name ?? "",
            CategoryName = asset.Category?.Name ?? "",
            Status = asset.Status,
            QualityFlag = asset.QualityFlag,
            ManualReviewRequired = true,
            ManualReviewReason = asset.ManualReviewReason ?? "No se puede calcular depreciación."
        };
}