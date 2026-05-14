namespace CRMService.Application.Contacts.DTOs;

public record UpdateContactDto(
    string? FirstName,
    string? LastName,
    string? Email,
    string? Phone
);
