using CRMService.Domain.Contacts;
using CRMService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRMService.Infrastructure.Contacts;

public class ContactRepository : BaseRepository<Contact>, IContactRepository
{
    public ContactRepository(CrmDbContext context) : base(context) { }

    public async Task<IEnumerable<Contact>> GetByCompanyIdAsync(Guid companyId, CancellationToken ct = default)
        => await _dbSet.AsNoTracking()
            .Where(c => c.CompanyId == companyId)
            .ToListAsync(ct);
}
