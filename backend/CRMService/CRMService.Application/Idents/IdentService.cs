using CRMService.Application.Idents.DTOs;
using CRMService.Domain.Idents;

namespace CRMService.Application.Idents;

public class IdentService : IIdentService
{
    private readonly IIdentRepository _repository;

    public IdentService(IIdentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<IdentDto>> GetAllAsync(CancellationToken ct = default)
    {
        var idents = await _repository.GetAllAsync(ct);
        return idents.Select(ToDto);
    }

    public async Task<IdentDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var ident = await _repository.GetByIdAsync(id, ct);
        return ident is null ? null : ToDto(ident);
    }

    public async Task<IEnumerable<IdentDto>> GetBySubjectIdAsync(Guid subjectId, CancellationToken ct = default)
    {
        var idents = await _repository.GetBySubjectIdAsync(subjectId, ct);
        return idents.Select(ToDto);
    }

    public async Task<IdentDto> CreateAsync(CreateIdentDto dto, CancellationToken ct = default)
    {
        var ident = Ident.Create(dto.Type, dto.Value, dto.SubjectId);
        await _repository.AddAsync(ident, ct);
        return ToDto(ident);
    }

    public async Task<IdentDto> UpdateAsync(Guid id, UpdateIdentDto dto, CancellationToken ct = default)
    {
        var ident = await _repository.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Ident {id} not found.");

        ident.Update(dto.Type, dto.Value);
        await _repository.UpdateAsync(ident, ct);
        return ToDto(ident);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        => await _repository.DeleteAsync(id, ct);

    private static IdentDto ToDto(Ident i) =>
        new(i.Id, i.Type, i.Value, i.SubjectId, i.CreatedAt, i.UpdatedAt);
}
