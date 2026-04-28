using CRMService.Application.Subjects.DTOs;

namespace CRMService.Application.Subjects;

public interface ISubjectService
{
    Task<IEnumerable<SubjectDto>> GetAllAsync(CancellationToken ct = default);
    Task<SubjectDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<SubjectDto> CreateAsync(CreateSubjectDto dto, CancellationToken ct = default);
    Task<SubjectDto> UpdateAsync(Guid id, UpdateSubjectDto dto, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
