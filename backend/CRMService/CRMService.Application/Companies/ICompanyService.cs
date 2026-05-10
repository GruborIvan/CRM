using CRMService.Application.Companies.DTOs;

namespace CRMService.Application.Companies;

public interface ICompanyService
{
    Task<IEnumerable<CompanyDto>> GetAllAsync(CancellationToken ct = default);
    Task<CompanyDto?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<CompanyDto> CreateAsync(CreateCompanyDto dto, CancellationToken ct = default);
    Task<CompanyDto> UpdateAsync(Guid id, UpdateCompanyDto dto, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}
