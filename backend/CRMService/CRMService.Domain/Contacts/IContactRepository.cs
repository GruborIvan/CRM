using CRMService.Domain.Common;

namespace CRMService.Domain.Contacts;

public interface IContactRepository : IRepository<Contact>
{
    Task<IEnumerable<Contact>> GetBySubjectIdAsync(Guid subjectId, CancellationToken ct = default);
}
