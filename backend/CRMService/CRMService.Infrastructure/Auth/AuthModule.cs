using CRMService.Application.Common;
using CRMService.Domain.Users;
using Microsoft.Extensions.DependencyInjection;

namespace CRMService.Infrastructure.Auth;

public static class AuthModule
{
    public static IServiceCollection AddAuthModule(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<ITokenService, TokenService>();
        return services;
    }
}
