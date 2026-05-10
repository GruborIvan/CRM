using CRMService.Domain.Common;

namespace CRMService.Domain.Customers;

public interface ICustomerRepository : IRepository<Customer>
{
    Task<Customer?> GetByEmailAsync(string email, CancellationToken ct = default);
}
