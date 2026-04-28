using CRMService.Application.Contacts.DTOs;

namespace CRMService.Application.Contacts;

public interface IContactService
{
    Task<IEnumerable<ContactDto>> GetAllAsync(CancellationToken ct = default);
    Task<ContactDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IEnumerable<ContactDto>> GetBySubjectIdAsync(Guid subjectId, CancellationToken ct = default);
    Task<ContactDto> CreateAsync(CreateContactDto dto, CancellationToken ct = default);
    Task<ContactDto> UpdateAsync(Guid id, UpdateContactDto dto, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
