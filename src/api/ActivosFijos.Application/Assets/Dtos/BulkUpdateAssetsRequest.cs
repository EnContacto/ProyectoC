namespace ActivosFijos.Application.Assets.Dtos;

public class BulkUpdateAssetsRequest
{
    public List<Guid> Ids { get; set; } = new();
    public BulkUpdateAssetsFields Fields { get; set; } = new();
}

public class BulkUpdateAssetsFields
{
    public Guid? CategoryId { get; set; }
    public Guid? AccountingAccountId { get; set; }
    public Guid? LocationId { get; set; }
    public Guid? CompanyId { get; set; }
}

public class BulkUpdateAssetsResult
{
    public int Updated { get; set; }
    public List<Guid> Failed { get; set; } = new();
}
