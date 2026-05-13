using CRMService.Domain.Users;

namespace CRMService.Application.Users.DTOs;

public record UserProfileDto(
    Guid Id,
    string Username,
    string Email,
    string? FirstName,
    string? LastName,
    string? ProfilePictureUrl,
    bool IsActive,
    DateTime? LastLoginAt,
    DateTime CreatedAt)
{
    public static UserProfileDto FromUser(User user) => new(
        user.Id,
        user.Username,
        user.Email,
        user.FirstName,
        user.LastName,
        user.ProfilePictureUrl,
        user.IsActive,
        user.LastLoginAt,
        user.CreatedAt);
}
