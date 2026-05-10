using CRMService.Domain.Companies;
using Microsoft.Extensions.DependencyInjection;

namespace CRMService.Infrastructure.Companies;

public static class CompaniesModule
{
    public static IServiceCollection AddCompaniesModule(this IServiceCollection services)
    {
        services.AddScoped<ICompanyRepository, CompanyRepository>();
        return services;
    }
}
