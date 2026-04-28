namespace CRMService.Application.Subjects.DTOs;

public record CreateSubjectDto(string Name, string? TaxNumber, string? Address);
