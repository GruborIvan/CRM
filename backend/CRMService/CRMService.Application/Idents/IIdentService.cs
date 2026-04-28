using CRMService.Application.Idents.DTOs;

namespace CRMService.Application.Idents;

public interface IIdentService
{
    Task<IEnumerable<IdentDto>> GetAllAsync(CancellationToken ct = default);
    Task<IdentDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<IdentDto>> GetBySubjectIdAsync(Guid subjectId, CancellationToken ct = default);
    Task<IdentDto> CreateAsync(CreateIdentDto dto, CancellationToken ct = default);
    Task<IdentDto> UpdateAsync(Guid id, UpdateIdentDto dto, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
