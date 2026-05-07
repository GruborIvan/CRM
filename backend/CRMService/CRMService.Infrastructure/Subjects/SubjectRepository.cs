using CRMService.Domain.Subjects;
using CRMService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRMService.Infrastructure.Subjects;

public class SubjectRepository : BaseRepository<Subject>, ISubjectRepository
{
    public SubjectRepository(CrmDbContext context) : base(context) { }

    public async Task<Subject?> GetWithDetailsAsync(Guid id, CancellationToken ct = default)
        => await _dbSet
            .Include(s => s.Contacts)
            .Include(s => s.Idents)
            .FirstOrDefaultAsync(s => s.Id == id, ct);
}
