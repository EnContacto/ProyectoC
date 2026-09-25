using ActivosFijos.Application.Imports;
using ActivosFijos.Application.Imports.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivosFijos.Api.Controllers;

[ApiController]
[Route("api/imports")]
[Authorize]
public class ImportsController : ControllerBase
{
    private readonly IImportService _service;

    public ImportsController(IImportService service) => _service = service;

    [HttpPost("upload")]
    [RequestSizeLimit(50 * 1024 * 1024)]
    public async Task<IActionResult> Upload(
        IFormFile file,
        [FromForm] bool dryRun = false,
        [FromForm] bool ignoreErrors = true,
        [FromForm] bool skipDuplicates = true,
        CancellationToken ct = default)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "Archivo vacío." });

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (extension != ".xlsx" && extension != ".xlsm")
            return BadRequest(new { message = "Solo se permiten archivos .xlsx o .xlsm." });

        var options = new ImportOptions
        {
            DryRun = dryRun,
            IgnoreErrors = ignoreErrors,
            SkipDuplicates = skipDuplicates
        };

        await using var stream = file.OpenReadStream();
        var result = await _service.ImportAsync(stream, file.FileName, options, ct);
        return Ok(result);
    }

    [HttpGet("batches")]
    public async Task<IActionResult> ListBatches(CancellationToken ct)
        => Ok(await _service.ListBatchesAsync(ct));

    [HttpGet("batches/{batchId:guid}")]
    public async Task<IActionResult> GetBatch(Guid batchId, CancellationToken ct)
    {
        var result = await _service.GetBatchAsync(batchId, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPost("batches/{batchId:guid}/revert")]
    public async Task<IActionResult> Revert(Guid batchId, CancellationToken ct)
    {
        var ok = await _service.RevertAsync(batchId, ct);
        return ok ? Ok(new { reverted = true }) : BadRequest(new { message = "No se pudo revertir." });
    }
}
