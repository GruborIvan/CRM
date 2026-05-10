using CRMService.Domain.Common;

namespace CRMService.Domain.Contacts;

public interface IContactRepository : IRepository<Contact>
{
    Task<IEnumerable<Contact>> GetByCompanyIdAsync(Guid companyId, CancellationToken ct = default);
}
