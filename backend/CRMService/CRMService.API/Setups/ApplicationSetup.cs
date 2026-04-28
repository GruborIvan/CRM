using CRMService.Application.Auth;
using CRMService.Application.Contacts;
using CRMService.Application.Idents;
using CRMService.Application.Subjects;

namespace CRMService.API.Setups;

public class ApplicationSetup : IServiceSetup
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IContactService, ContactService>();
        services.AddScoped<IIdentService, IdentService>();
        services.AddScoped<ISubjectService, SubjectService>();
    }
}
