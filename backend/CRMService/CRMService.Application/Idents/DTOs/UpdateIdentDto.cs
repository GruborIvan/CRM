using CRMService.Domain.Idents;

namespace CRMService.Application.Idents.DTOs;

public record UpdateIdentDto(IdentType Type, string Value);
