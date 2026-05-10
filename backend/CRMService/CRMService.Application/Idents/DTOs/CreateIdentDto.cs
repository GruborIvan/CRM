using CRMService.Domain.Idents;

namespace CRMService.Application.Idents.DTOs;

public record CreateIdentDto(IdentType Type, string Value, Guid CompanyId);
