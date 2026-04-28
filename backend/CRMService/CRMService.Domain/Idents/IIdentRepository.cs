using CRMService.Domain.Common;

namespace CRMService.Domain.Idents;

public interface IIdentRepository : IRepository<Ident>
{
    Task<IEnumerable<Ident>> GetBySubjectIdAsync(Guid subjectId, CancellationToken ct = default);
}
