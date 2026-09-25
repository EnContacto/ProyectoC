namespace ActivosFijos.Domain.Services;

public class DepreciationInput
{
    public decimal AcquisitionValue { get; set; }
    public decimal ResidualRate { get; set; }
    public DateTime PurchaseDate { get; set; }
    public int UsefulLifeYears { get; set; }
}

public class MonthlyDepreciation
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int DaysInPeriod { get; set; }
    public decimal DepreciationAmount { get; set; }
    public decimal AccumulatedDepreciation { get; set; }
    public decimal NetCost { get; set; }
}

public class DepreciationResult
{
    public decimal AcquisitionValue { get; set; }
    public decimal ResidualValue { get; set; }
    public decimal DepreciableAmount { get; set; }
    public DateTime DepreciationStartDate { get; set; }
    public DateTime FinalDepreciationDate { get; set; }
    public int TotalDaysToDepreciate { get; set; }
    public decimal DailyRate { get; set; }
    public IReadOnlyList<MonthlyDepreciation> MonthlySchedule { get; set; } = Array.Empty<MonthlyDepreciation>();

    public decimal GetAccumulatedAt(DateTime date)
    {
        return MonthlySchedule
            .Where(m => new DateTime(m.Year, m.Month, 1) <= new DateTime(date.Year, date.Month, 1))
            .Select(m => m.DepreciationAmount)
            .Sum();
    }

    public decimal GetNetCostAt(DateTime date)
        => AcquisitionValue - GetAccumulatedAt(date);

    public decimal GetDepreciationForYear(int year)
        => MonthlySchedule.Where(m => m.Year == year).Sum(m => m.DepreciationAmount);
}

public static class DepreciationCalculator
{
    public static DepreciationResult Calculate(DepreciationInput input)
    {
        if (input.AcquisitionValue <= 0)
            throw new ArgumentException("El valor de adquisición debe ser mayor a cero.");
        if (input.ResidualRate < 0 || input.ResidualRate >= 1)
            throw new ArgumentException("La tasa de valor residual debe estar entre 0 y 1.");
        if (input.UsefulLifeYears <= 0)
            throw new ArgumentException("La vida útil debe ser mayor a cero.");
        if (input.PurchaseDate == default)
            throw new ArgumentException("La fecha de compra es obligatoria.");

        var residualValue = Math.Round(input.AcquisitionValue * input.ResidualRate, 2);
        var depreciableAmount = input.AcquisitionValue - residualValue;

        // Primer día del mes siguiente a la compra
        var startDate = new DateTime(input.PurchaseDate.Year, input.PurchaseDate.Month, 1).AddMonths(1);
        var finalDate = startDate.AddYears(input.UsefulLifeYears).AddDays(-1);
        var totalDays = (finalDate - startDate).Days + 1;

        var dailyRate = depreciableAmount / totalDays;

        var monthly = new List<MonthlyDepreciation>();
        var accumulated = 0m;
        var current = startDate;

        while (current <= finalDate)
        {
            var monthStart = new DateTime(current.Year, current.Month, 1);
            var monthEnd = monthStart.AddMonths(1).AddDays(-1);

            var effectiveStart = current > monthStart ? current : monthStart;
            var effectiveEnd = finalDate < monthEnd ? finalDate : monthEnd;

            var daysInPeriod = (effectiveEnd - effectiveStart).Days + 1;
            var depreciationForMonth = dailyRate * daysInPeriod;

            var newAccumulated = accumulated + depreciationForMonth;
            if (newAccumulated > depreciableAmount)
            {
                depreciationForMonth -= newAccumulated - depreciableAmount;
                newAccumulated = depreciableAmount;
            }

            monthly.Add(new MonthlyDepreciation
            {
                Year = current.Year,
                Month = current.Month,
                DaysInPeriod = daysInPeriod,
                DepreciationAmount = Math.Round(depreciationForMonth, 2),
                AccumulatedDepreciation = Math.Round(newAccumulated, 2),
                NetCost = Math.Round(input.AcquisitionValue - newAccumulated, 2)
            });

            accumulated = newAccumulated;
            current = current.AddMonths(1);
        }

        return new DepreciationResult
        {
            AcquisitionValue = input.AcquisitionValue,
            ResidualValue = residualValue,
            DepreciableAmount = depreciableAmount,
            DepreciationStartDate = startDate,
            FinalDepreciationDate = finalDate,
            TotalDaysToDepreciate = totalDays,
            DailyRate = dailyRate,
            MonthlySchedule = monthly
        };
    }
}