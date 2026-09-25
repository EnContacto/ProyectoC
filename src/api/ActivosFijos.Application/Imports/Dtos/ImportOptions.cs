namespace ActivosFijos.Application.Imports.Dtos;

public class ImportOptions
{
    public bool DryRun { get; set; }
    public bool IgnoreErrors { get; set; } = true;
    public bool SkipDuplicates { get; set; } = true;
    public List<string>? ExcludedColumns { get; set; }
    public List<string>? IncludedSheets { get; set; }
}