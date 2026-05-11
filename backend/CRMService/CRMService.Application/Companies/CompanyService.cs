using CRMService.Application.Companies.DTOs;
using CRMService.Application.Contacts.DTOs;
using CRMService.Domain.Companies;
using CRMService.Domain.Contacts;

namespace CRMService.Application.Companies;

public class CompanyService : ICompanyService
{
    private readonly ICompanyRepository _repository;

    public CompanyService(ICompanyRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CompanyDto>> GetAllAsync(CancellationToken ct = default)
    {
        var companies = await _repository.GetAllAsync(ct);
        return companies.Select(ToDto);
    }

    public async Task<CompanyDto?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var company = await _repository.GetWithDetailsAsync(id, ct);
        return company is null ? null : ToDtoWithContacts(company);
    }

    public async Task<CompanyDto> CreateAsync(CreateCompanyDto dto, CancellationToken ct = default)
    {
        var company = Company.Create(
            dto.Name, dto.Status,
            dto.Email, dto.Phone, dto.Website,
            dto.City, dto.Address, dto.Industry, dto.Notes);

        await _repository.AddAsync(company, ct);
        return ToDto(company);
    }

    public async Task<CompanyDto> UpdateAsync(Guid id, UpdateCompanyDto dto, CancellationToken ct = default)
    {
        var company = await _repository.GetByIdAsync(id, ct)
            ?? throw new KeyNotFoundException($"Company {id} not found.");

        company.Update(
            dto.Name, dto.Status,
            dto.Email, dto.Phone, dto.Website,
            dto.City, dto.Address, dto.Industry, dto.Notes);

        await _repository.UpdateAsync(company, ct);
        return ToDto(company);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
        => await _repository.DeleteAsync(id, ct);

    private static CompanyDto ToDto(Company c) => new(
        c.Id, c.Name, c.Email, c.Phone, c.Website,
        c.City, c.Address, c.Industry, c.Notes,
        c.Status, c.CreatedAt, c.UpdatedAt);

    private static CompanyDto ToDtoWithContacts(Company c) => new(
        c.Id, c.Name, c.Email, c.Phone, c.Website,
        c.City, c.Address, c.Industry, c.Notes,
        c.Status, c.CreatedAt, c.UpdatedAt,
        c.Contacts.Select(ContactToDto).ToList().AsReadOnly());

    private static ContactDto ContactToDto(Contact c) => new(
        c.Id, c.FirstName, c.LastName, c.Email, c.Phone,
        c.CompanyId, c.CreatedAt, c.UpdatedAt);
}
