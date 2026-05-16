namespace CRMService.Application.Users.DTOs;

public record UpdateProfileDto(
    string? FirstName,
    string? LastName,
    string? Email
);
