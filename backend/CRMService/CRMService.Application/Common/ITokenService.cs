using CRMService.Domain.Users;

namespace CRMService.Application.Common;

public interface ITokenService
{
    (string Token, DateTime ExpiresAt) CreateAccessToken(User user);
    (string Token, DateTime ExpiresAt) CreateRefreshToken();
}
