namespace CRMService.Application.Auth.DTOs;

public record TokenResponseDto(
    string AccessToken,
    string RefreshToken,
    DateTime ExpiresAt
);
