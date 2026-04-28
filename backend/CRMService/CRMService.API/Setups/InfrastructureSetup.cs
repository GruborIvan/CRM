using CRMService.Application.Common;
using CRMService.Domain.Contacts;
using CRMService.Domain.Idents;
using CRMService.Domain.Subjects;
using CRMService.Domain.Users;
using CRMService.Infrastructure.Persistence;
using CRMService.Infrastructure.Repositories;
using CRMService.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;

namespace CRMService.API.Setups;

public class InfrastructureSetup : IServiceSetup
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CrmDbContext>(options =>
            options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<ITokenService, TokenService>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IContactRepository, ContactRepository>();
        services.AddScoped<IIdentRepository, IdentRepository>();
        services.AddScoped<ISubjectRepository, SubjectRepository>();
    }
}
