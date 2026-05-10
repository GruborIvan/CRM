using CRMService.Domain.Companies;

namespace CRMService.Application.Companies.DTOs;

public record UpdateCompanyDto(
    string Name,
    CompanyStatus Status,
    string? Email,
    string? Phone,
    string? Website,
    string? City,
    string? Address,
    string? Industry,
    string? Notes
);
