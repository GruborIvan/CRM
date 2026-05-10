using CRMService.Domain.Common;

namespace CRMService.Domain.Companies;

public interface ICompanyRepository : IRepository<Company>
{
    Task<Company?> GetWithDetailsAsync(Guid id, CancellationToken ct = default);
}
