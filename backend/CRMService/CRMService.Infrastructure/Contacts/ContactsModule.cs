using CRMService.Domain.Contacts;
using Microsoft.Extensions.DependencyInjection;

namespace CRMService.Infrastructure.Contacts;

public static class ContactsModule
{
    public static IServiceCollection AddContactsModule(this IServiceCollection services)
    {
        services.AddScoped<IContactRepository, ContactRepository>();
        return services;
    }
}
