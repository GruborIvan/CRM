using CRMService.Application.Contacts.DTOs;
using CRMService.Domain.Companies;

namespace CRMService.Application.Companies.DTOs;

public record CompanyDto(
    Guid Id,
    string Name,
    string? Email,
    string? Phone,
    string? Website,
    string? City,
    string? Address,
    string? Industry,
    string? Notes,
    CompanyStatus Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    IReadOnlyList<ContactDto>? Contacts = null
);
