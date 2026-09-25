using ActivosFijos.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class CatalogsController : ControllerBase
{
    private readonly ActivosFijosDbContext _db;

    public CatalogsController(ActivosFijosDbContext db) => _db = db;

    [HttpGet("companies")]
    public async Task<IActionResult> Companies(CancellationToken ct)
        => Ok(await _db.Companies.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new { x.Id, x.Name, Code = x.ShortName })
            .ToListAsync(ct));

    [HttpGet("categories")]
    public async Task<IActionResult> Categories(CancellationToken ct)
        => Ok(await _db.Categories.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.DisplayOrder)
            .ThenBy(x => x.Name)
            .Select(x => new { x.Id, x.Name, Code = x.ShortCode })
            .ToListAsync(ct));

    [HttpGet("locations")]
    public async Task<IActionResult> Locations(CancellationToken ct)
        => Ok(await _db.Locations.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new { x.Id, x.Name })
            .ToListAsync(ct));

    [HttpGet("custodians")]
    public async Task<IActionResult> Custodians(CancellationToken ct)
        => Ok(await _db.Custodians.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .Select(x => new { x.Id, x.Name })
            .ToListAsync(ct));

    [HttpGet("accounting-accounts")]
    public async Task<IActionResult> AccountingAccounts(CancellationToken ct)
        => Ok(await _db.AccountingAccounts.AsNoTracking()
            .Where(x => x.IsActive)
            .OrderBy(x => x.Code)
            .Select(x => new { x.Id, x.Code, x.Name })
            .ToListAsync(ct));
}
