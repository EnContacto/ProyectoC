using ActivosFijos.Application.Depreciations;
using ActivosFijos.Application.Depreciations.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivosFijos.Api.Controllers;

[ApiController]
[Route("api/depreciations")]
[Authorize]
public class DepreciationsController : ControllerBase
{
    private readonly IDepreciationService _service;

    public DepreciationsController(IDepreciationService service) => _service = service;

    [HttpGet("asset/{assetId:guid}")]
    public async Task<IActionResult> GetByAsset(Guid assetId, CancellationToken ct)
    {
        var dto = await _service.GetByAssetAsync(assetId, ct);
        return dto is null ? NotFound() : Ok(dto);
    }

    [HttpPost("projection")]
    public async Task<IActionResult> Projection([FromBody] ProjectionRequest request, CancellationToken ct)
        => Ok(await _service.GetProjectionAsync(request, ct));
}