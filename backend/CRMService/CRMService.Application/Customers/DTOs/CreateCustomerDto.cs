namespace CRMService.Application.Customers.DTOs;

public record CreateCustomerDto(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string? Company,
    string? JobTitle,
    string? Address,
    string? Language
);
