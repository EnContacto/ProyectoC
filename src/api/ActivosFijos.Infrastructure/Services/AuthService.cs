using ActivosFijos.Application.Auth;
using ActivosFijos.Application.Auth.Dtos;
using ActivosFijos.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly ActivosFijosDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokens;

    public AuthService(ActivosFijosDbContext db, IPasswordHasher hasher, ITokenService tokens)
    {
        _db = db;
        _hasher = hasher;
        _tokens = tokens;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Username == request.Username && x.IsActive, ct);
        if (user is null) return null;
        if (!_hasher.Verify(request.Password, user.PasswordHash)) return null;

        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        var (token, expires) = _tokens.GenerateToken(user);

        return new LoginResponse
        {
            Token = token,
            ExpiresAt = expires,
            Username = user.Username,
            FullName = user.FullName
        };
    }

    public async Task<CurrentUserResponse?> GetCurrentAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == userId && x.IsActive, ct);
        if (user is null) return null;

        return new CurrentUserResponse
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email
        };
    }
}