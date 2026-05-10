namespace CRMService.Application.Contacts.DTOs;

public record CreateContactDto(
    string FirstName,
    string LastName,
    string Email,
    string Phone,
    Guid CompanyId
);
