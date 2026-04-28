using CRMService.Domain.Common;

namespace CRMService.Domain.Subjects;

public interface ISubjectRepository : IRepository<Subject>
{
    Task<Subject?> GetWithDetailsAsync(Guid id, CancellationToken ct = default);
}
