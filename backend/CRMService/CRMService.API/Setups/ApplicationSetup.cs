using CRMService.Application.Auth;
using CRMService.Application.Companies;
using CRMService.Application.Contacts;
using CRMService.Application.Customers;
using CRMService.Application.Idents;

namespace CRMService.API.Setups;

public class ApplicationSetup : IServiceSetup
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICompanyService, CompanyService>();
        services.AddScoped<ICustomerService, CustomerService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IIdentService, IdentService>();
    }
}
