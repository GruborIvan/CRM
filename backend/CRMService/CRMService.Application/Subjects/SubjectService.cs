using CRMService.Application.Subjects.DTOs;
using CRMService.Domain.Subjects;

namespace CRMService.Application.Subjects;

public class SubjectService : ISubjectService
{
    private readonly ISubjectRepository _repository;

    public SubjectService(ISubjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<SubjectDto>> GetAllAsync(CancellationToken ct = default)
    {
        var subjects = await _repository.GetAllAsync(ct);
        return subjects.Select(ToDto);
    }

    public async Task<SubjectDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var subject = await _repository.GetByIdAsync(id, ct);
        return subject is null ? null : ToDto(subject);
    }

    public async Task<SubjectDto> CreateAsync(CreateSubjectDto dto, CancellationToken ct = default)
    {
        var subject = Subject.Create(dto.Name, dto.TaxNumber, dto.Address);
        await _repository.AddAsync(subject, ct);
        return ToDto(subject);
    }

    public async Task<SubjectDto> UpdateAsync(Guid id, UpdateSubjectDto dto, CancellationToken ct = default)
    {
        var subject = await _repository.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Subject {id} not found.");

        subject.Update(dto.Name, dto.TaxNumber, dto.Address);
        await _repository.UpdateAsync(subject, ct);
        return ToDto(subject);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        => await _repository.DeleteAsync(id, ct);

    private static SubjectDto ToDto(Subject s) =>
        new(s.Id, s.Name, s.TaxNumber, s.Address, s.CreatedAt, s.UpdatedAt);
}
