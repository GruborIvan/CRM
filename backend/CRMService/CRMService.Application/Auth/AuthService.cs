using CRMService.Application.Auth.DTOs;
using CRMService.Application.Common;
using CRMService.Application.Common.Exceptions;
using CRMService.Domain.Users;

namespace CRMService.Application.Auth;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ITokenService _tokenService;

    public AuthService(IUserRepository users, IPasswordHasher passwordHasher, ITokenService tokenService)
    {
        _users = users;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
    }

    public async Task<TokenResponseDto> RegisterAsync(RegisterDto dto, CancellationToken ct = default)
    {
        if (await _users.GetByUsernameAsync(dto.Username, ct) is not null)
            throw new ConflictException("Username already taken.");

        if (await _users.GetByEmailAsync(dto.Email, ct) is not null)
            throw new ConflictException("Email already in use.");

        var user = User.Create(dto.Username, dto.Email, _passwordHasher.Hash(dto.Password));
        await _users.AddAsync(user, ct);

        return await IssueTokensAsync(user, ct);
    }

    public async Task<TokenResponseDto> LoginAsync(LoginDto dto, CancellationToken ct = default)
    {
        var user = await _users.GetByUsernameAsync(dto.Username, ct)
            ?? throw new UnauthorizedException("Invalid credentials.");

        if (!_passwordHasher.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid credentials.");

        return await IssueTokensAsync(user, ct);
    }

    public async Task<TokenResponseDto> RefreshAsync(RefreshTokenDto dto, CancellationToken ct = default)
    {
        var user = await _users.GetByRefreshTokenAsync(dto.RefreshToken, ct)
            ?? throw new UnauthorizedException("Invalid refresh token.");

        if (!user.IsRefreshTokenValid(dto.RefreshToken))
            throw new UnauthorizedException("Refresh token expired.");

        return await IssueTokensAsync(user, ct);
    }

    private async Task<TokenResponseDto> IssueTokensAsync(User user, CancellationToken ct)
    {
        var (accessToken, expiresAt) = _tokenService.CreateAccessToken(user);
        var (refreshToken, refreshExpiresAt) = _tokenService.CreateRefreshToken();

        user.SetRefreshToken(refreshToken, refreshExpiresAt);
        await _users.UpdateAsync(user, ct);

        return new TokenResponseDto(accessToken, refreshToken, expiresAt);
    }
}
