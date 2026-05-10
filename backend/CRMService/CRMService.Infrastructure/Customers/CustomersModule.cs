using CRMService.Domain.Customers;
using Microsoft.Extensions.DependencyInjection;

namespace CRMService.Infrastructure.Customers;

public static class CustomersModule
{
    public static IServiceCollection AddCustomersModule(this IServiceCollection services)
    {
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        return services;
    }
}
