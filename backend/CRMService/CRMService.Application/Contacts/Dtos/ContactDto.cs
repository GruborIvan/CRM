namespace CRMService.Application.Contacts.DTOs;

public record ContactDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    Guid CompanyId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
