using CRMService.Application.Auth.DTOs;

namespace CRMService.Application.Auth;

public interface IAuthService
{
    Task<TokenResponseDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default);
    Task<TokenResponseDto> LoginAsync(LoginDto dto, CancellationToken ct = default);
    Task<TokenResponseDto> RefreshAsync(RefreshTokenDto dto, CancellationToken ct = default);
}
