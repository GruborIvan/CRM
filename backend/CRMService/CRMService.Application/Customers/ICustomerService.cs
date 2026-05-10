using CRMService.Application.Customers.DTOs;

namespace CRMService.Application.Customers;

public interface ICustomerService
{
    Task<IEnumerable<CustomerDto>> GetAllAsync(CancellationToken ct = default);
    Task<CustomerDto> CreateAsync(CreateCustomerDto dto, CancellationToken ct = default);
}
