using CRMService.Application.Common.Exceptions;
using CRMService.Application.Customers.DTOs;
using CRMService.Domain.Customers;
using Microsoft.Extensions.Logging;

namespace CRMService.Application.Customers;

public class CustomerService : ICustomerService
{
    private readonly ICustomerRepository _repository;
    private readonly ILogger<CustomerService> _logger;

    public CustomerService(ICustomerRepository repository, ILogger<CustomerService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<IEnumerable<CustomerDto>> GetAllAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("Fetching all customers");

        var customers = await _repository.GetAllAsync(ct);
        var result = customers.Select(ToDto).ToList();

        _logger.LogInformation("Returned {Count} customers", result.Count);

        return result;
    }

    public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto, CancellationToken ct = default)
    {
        _logger.LogInformation("Creating customer with email {Email}", dto.Email);

        var existing = await _repository.GetByEmailAsync(dto.Email, ct);
        if (existing is not null)
        {
            _logger.LogWarning("Customer creation failed — email {Email} already exists", dto.Email);
            throw new ConflictException($"A customer with email '{dto.Email}' already exists.");
        }

        var customer = Customer.Create(
            dto.FirstName, dto.LastName, dto.Email,
            dto.Phone, dto.Company, dto.JobTitle, dto.Address, dto.Language);

        await _repository.AddAsync(customer, ct);

        _logger.LogInformation("Customer {CustomerId} created successfully", customer.Id);

        return ToDto(customer);
    }

    private static CustomerDto ToDto(Customer c) => new(
        c.Id, c.FirstName, c.LastName, c.Email,
        c.Phone, c.Company, c.JobTitle, c.Address, c.Language,
        c.CreatedAt, c.UpdatedAt);
}
