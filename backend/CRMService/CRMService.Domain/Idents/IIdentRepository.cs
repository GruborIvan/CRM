using CRMService.Domain.Common;

namespace CRMService.Domain.Idents;

public interface IIdentRepository : IRepository<Ident>
{
    Task<IEnumerable<Ident>> GetByCompanyIdAsync(Guid companyId, CancellationToken ct = default);
}
