using CRMService.Domain.Idents;

namespace CRMService.Application.Idents.DTOs;

public record IdentDto(
    Guid Id,
    IdentType Type,
    string Value,
    Guid SubjectId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
