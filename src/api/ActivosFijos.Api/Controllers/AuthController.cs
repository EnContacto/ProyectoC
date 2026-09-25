using System.Security.Claims;
using ActivosFijos.Application.Auth;
using ActivosFijos.Application.Auth.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivosFijos.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;

    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct)
    {
        var result = await _auth.LoginAsync(request, ct);
        if (result is null) return Unauthorized(new { message = "Credenciales inválidas" });
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        var id = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (id is null) return Unauthorized();

        var result = await _auth.GetCurrentAsync(Guid.Parse(id), ct);
        if (result is null) return Unauthorized();
        return Ok(result);
    }
}