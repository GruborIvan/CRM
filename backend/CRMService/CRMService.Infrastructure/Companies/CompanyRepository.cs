using CRMService.Domain.Companies;
using CRMService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRMService.Infrastructure.Companies;

public class CompanyRepository : BaseRepository<Company>, ICompanyRepository
{
    public CompanyRepository(CrmDbContext context) : base(context) { }

    public async Task<Company?> GetWithDetailsAsync(Guid id, CancellationToken ct = default)
        => await _dbSet
            .Include(c => c.Contacts)
            .Include(c => c.Idents)
            .FirstOrDefaultAsync(c => c.Id == id, ct);
}
