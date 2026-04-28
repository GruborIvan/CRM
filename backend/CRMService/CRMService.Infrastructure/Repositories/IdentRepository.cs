using CRMService.Domain.Idents;
using CRMService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRMService.Infrastructure.Repositories;

public class IdentRepository : BaseRepository<Ident>, IIdentRepository
{
    public IdentRepository(CrmDbContext context) : base(context) { }

    public async Task<IEnumerable<Ident>> GetBySubjectIdAsync(Guid subjectId, CancellationToken ct = default)
        => await _dbSet.AsNoTracking()
            .Where(i => i.SubjectId == subjectId)
            .ToListAsync(ct);
}
