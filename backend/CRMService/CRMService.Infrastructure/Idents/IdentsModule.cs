using CRMService.Domain.Idents;
using Microsoft.Extensions.DependencyInjection;

namespace CRMService.Infrastructure.Idents;

public static class IdentsModule
{
    public static IServiceCollection AddIdentsModule(this IServiceCollection services)
    {
        services.AddScoped<IIdentRepository, IdentRepository>();
        return services;
    }
}
