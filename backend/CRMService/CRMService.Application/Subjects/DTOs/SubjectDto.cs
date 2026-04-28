namespace CRMService.Application.Subjects.DTOs;

public record SubjectDto(
    Guid Id,
    string Name,
    string? TaxNumber,
    string? Address,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
