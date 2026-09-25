using ActivosFijos.Application.Auth.Dtos;

namespace ActivosFijos.Application.Auth;

public interface IAuthService
{
    Task<LoginResponse?> LoginAsync(LoginRequest request, CancellationToken ct = default);
    Task<CurrentUserResponse?> GetCurrentAsync(Guid userId, CancellationToken ct = default);
}