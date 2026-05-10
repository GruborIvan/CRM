using CRMService.Domain.Idents;
using CRMService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRMService.Infrastructure.Idents;

public class IdentRepository : BaseRepository<Ident>, IIdentRepository
{
    public IdentRepository(CrmDbContext context) : base(context) { }

    public async Task<IEnumerable<Ident>> GetByCompanyIdAsync(Guid companyId, CancellationToken ct = default)
        => await _dbSet.AsNoTracking()
            .Where(i => i.CompanyId == companyId)
            .ToListAsync(ct);
}
