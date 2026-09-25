namespace ActivosFijos.Infrastructure.Excel;

public class ExcelSheetData
{
    public string SheetName { get; set; } = string.Empty;
    public List<string> Headers { get; set; } = new();
    public List<ExcelRowData> Rows { get; set; } = new();
}

public class ExcelRowData
{
    public int RowNumber { get; set; }
    public Dictionary<string, string?> Values { get; set; } = new();
}

public interface IExcelReader
{
    IReadOnlyList<ExcelSheetData> Read(Stream stream, IReadOnlyCollection<string>? includedSheets = null);
}