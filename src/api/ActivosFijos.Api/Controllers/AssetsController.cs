using ActivosFijos.Application.Assets;
using ActivosFijos.Application.Assets.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivosFijos.Api.Controllers;

[ApiController]
[Route("api/assets")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly IAssetService _service;

    public AssetsController(IAssetService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] AssetFilterRequest filter, CancellationToken ct)
        => Ok(await _service.SearchAsync(filter, ct));

    [HttpGet("summary")]
    public async Task<IActionResult> Summary([FromQuery] AssetFilterRequest filter, CancellationToken ct)
        => Ok(await _service.GetSummaryAsync(filter, ct));

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var dto = await _service.GetByIdAsync(id, ct);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAssetRequest request, CancellationToken ct)
    {
        var dto = await _service.CreateAsync(request, ct);
        return CreatedAtAction(nameof(Get), new { id = dto.Id }, dto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateAssetRequest request, CancellationToken ct)
    {
        var dto = await _service.UpdateAsync(id, request, ct);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPatch("bulk")]
    public async Task<IActionResult> BulkUpdate([FromBody] BulkUpdateAssetsRequest request, CancellationToken ct)
    {
        if (request.Ids is null || request.Ids.Count == 0 || request.Ids.Contains(Guid.Empty) ||
            request.Fields is null ||
            (!request.Fields.CategoryId.HasValue && !request.Fields.AccountingAccountId.HasValue &&
             !request.Fields.LocationId.HasValue && !request.Fields.CompanyId.HasValue))
            return BadRequest(new { message = "Se requieren IDs de activos y al menos un campo." });

        try
        {
            return Ok(await _service.BulkUpdateAsync(request, ct));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
        => await _service.DeleteAsync(id, ct) ? NoContent() : NotFound();

    [HttpPost("recalculate")]
    public async Task<IActionResult> RecalculateAll(CancellationToken ct)
    {
        var count = await _service.RecalculateAllAsync(ct);
        return Ok(new { recalculated = count });
    }
}
