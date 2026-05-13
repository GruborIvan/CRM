namespace CRMService.Application.Auth.DTOs;

public record RegisterDto(string Username, string Email, string Password, string? FirstName = null, string? LastName = null);
