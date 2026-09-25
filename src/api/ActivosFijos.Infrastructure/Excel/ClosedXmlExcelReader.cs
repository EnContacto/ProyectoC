using ClosedXML.Excel;

namespace ActivosFijos.Infrastructure.Excel;

public class ClosedXmlExcelReader : IExcelReader
{
    private static readonly string[] ExpectedHeaders =
    {
        "no", "codigo actual", "codigo anterior", "empresa",
        "ubicacion / sede", "ubicacion especifica / departamento laboral",
        "custodio", "cuenta contable", "clase de activo", "nombre del activo",
        "detalle del bien", "marca", "modelo", "serie", "componentes",
        "capacidad", "dimensiones", "material", "color", "estado",
        "no. factura", "proveedor", "fecha de adquisicion", "año de adquisicion",
        "vida util anterior", "fecha final de depreciacion", "dias totales a depreciar",
        "valor de adquisicion (usd)", "valor residual anterior"
    };

    public IReadOnlyList<ExcelSheetData> Read(Stream stream, IReadOnlyCollection<string>? includedSheets = null)
    {
        var result = new List<ExcelSheetData>();
        using var workbook = new XLWorkbook(stream);

        foreach (var sheet in workbook.Worksheets)
        {
            if (includedSheets is not null && includedSheets.Count > 0 &&
                !includedSheets.Contains(sheet.Name, StringComparer.OrdinalIgnoreCase))
                continue;

            var data = ReadSheet(sheet);
            if (data.Rows.Count > 0 || data.Headers.Count > 0)
                result.Add(data);
        }

        return result;
    }

    private static ExcelSheetData ReadSheet(IXLWorksheet sheet)
    {
        var data = new ExcelSheetData { SheetName = sheet.Name };
        var used = sheet.RangeUsed();
        if (used is null) return data;

        var headerRowNumber = FindHeaderRow(sheet, used);
        if (headerRowNumber == 0) return data;

        var headerRow = sheet.Row(headerRowNumber);
        var lastColumn = used.LastColumnUsed()!.ColumnNumber();
        var columnMap = new Dictionary<int, string>();

        for (var col = 1; col <= lastColumn; col++)
        {
            var raw = headerRow.Cell(col).GetString();
            var normalized = Normalize(raw);
            if (string.IsNullOrWhiteSpace(normalized)) continue;
            columnMap[col] = normalized;
            data.Headers.Add(normalized);
        }

        var lastRow = used.LastRowUsed()!.RowNumber();
        for (var rowNumber = headerRowNumber + 1; rowNumber <= lastRow; rowNumber++)
        {
            var row = sheet.Row(rowNumber);
            var rowData = new ExcelRowData { RowNumber = rowNumber };
            var hasValue = false;

            foreach (var (col, header) in columnMap)
            {
                var cell = row.Cell(col);
                var value = GetCellString(cell);
                if (!string.IsNullOrWhiteSpace(value)) hasValue = true;
                rowData.Values[header] = value;
            }

            if (hasValue) data.Rows.Add(rowData);
        }

        return data;
    }

    private static int FindHeaderRow(IXLWorksheet sheet, IXLRange used)
    {
        var lastRow = used.LastRowUsed()!.RowNumber();
        var lastCol = used.LastColumnUsed()!.ColumnNumber();
        var maxScan = Math.Min(lastRow, 20);

        for (var rowNumber = 1; rowNumber <= maxScan; rowNumber++)
        {
            var matches = 0;
            for (var col = 1; col <= lastCol; col++)
            {
                var value = Normalize(sheet.Cell(rowNumber, col).GetString());
                if (string.IsNullOrWhiteSpace(value)) continue;
                if (ExpectedHeaders.Contains(value)) matches++;
            }
            if (matches >= 5) return rowNumber;
        }
        return 0;
    }

    private static string GetCellString(IXLCell cell)
    {
        if (cell.IsEmpty()) return string.Empty;
        if (cell.DataType == XLDataType.DateTime)
            return cell.GetDateTime().ToString("yyyy-MM-dd");
        if (cell.DataType == XLDataType.Number)
            return cell.GetDouble().ToString(System.Globalization.CultureInfo.InvariantCulture);
        return cell.GetString().Trim();
    }

    private static string Normalize(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return string.Empty;
        var s = input.Trim().ToLowerInvariant();
        var normalized = s.Normalize(System.Text.NormalizationForm.FormD);
        var sb = new System.Text.StringBuilder(normalized.Length);
        foreach (var c in normalized)
        {
            if (System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c)
                != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }
        return sb.ToString().Normalize(System.Text.NormalizationForm.FormC);
    }
}