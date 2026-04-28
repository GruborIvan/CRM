using CRMService.Application.Contacts.DTOs;
using CRMService.Domain.Contacts;

namespace CRMService.Application.Contacts;

public class ContactService : IContactService
{
    private readonly IContactRepository _repository;

    public ContactService(IContactRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ContactDto>> GetAllAsync(CancellationToken ct = default)
    {
        var contacts = await _repository.GetAllAsync(ct);
        return contacts.Select(ToDto);
    }

    public async Task<ContactDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var contact = await _repository.GetByIdAsync(id, ct);
        return contact is null ? null : ToDto(contact);
    }

    public async Task<IEnumerable<ContactDto>> GetBySubjectIdAsync(Guid subjectId, CancellationToken ct = default)
    {
        var contacts = await _repository.GetBySubjectIdAsync(subjectId, ct);
        return contacts.Select(ToDto);
    }

    public async Task<ContactDto> CreateAsync(CreateContactDto dto, CancellationToken ct = default)
    {
        var contact = Contact.Create(dto.FirstName, dto.LastName, dto.Email, dto.Phone, dto.SubjectId);
        await _repository.AddAsync(contact, ct);
        return ToDto(contact);
    }

    public async Task<ContactDto> UpdateAsync(Guid id, UpdateContactDto dto, CancellationToken ct = default)
    {
        var contact = await _repository.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Contact {id} not found.");

        contact.Update(dto.FirstName, dto.LastName, dto.Email, dto.Phone);
        await _repository.UpdateAsync(contact, ct);
        return ToDto(contact);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        => await _repository.DeleteAsync(id, ct);

    private static ContactDto ToDto(Contact c) =>
        new(c.Id, c.FirstName, c.LastName, c.Email, c.Phone, c.SubjectId, c.CreatedAt, c.UpdatedAt);
}
