namespace CRMService.Application.Contacts.DTOs;

public record ContactDto(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    Guid SubjectId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
