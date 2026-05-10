namespace CRMService.Application.Customers.DTOs;

public record CustomerDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Company,
    string? JobTitle,
    string? Address,
    string? Language,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
