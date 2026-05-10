using CRMService.Domain.Idents;

namespace CRMService.Application.Idents.DTOs;

public record IdentDto(
    Guid Id,
    IdentType Type,
    string Value,
    Guid CompanyId,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
