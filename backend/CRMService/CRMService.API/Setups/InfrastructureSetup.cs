using CRMService.Infrastructure.Auth;
using CRMService.Infrastructure.Companies;
using CRMService.Infrastructure.Contacts;
using CRMService.Infrastructure.Customers;
using CRMService.Infrastructure.Idents;
using CRMService.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CRMService.API.Setups;

public class InfrastructureSetup : IServiceSetup
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CrmDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services
            .AddAuthModule()
            .AddCompaniesModule()
            .AddCustomersModule()
            .AddContactsModule()
            .AddIdentsModule();
    }
}
