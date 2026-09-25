using ActivosFijos.Domain.Entities;

namespace ActivosFijos.Application.Auth;

public interface ITokenService
{
    (string token, DateTime expiresAt) GenerateToken(User user);
}