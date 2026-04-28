namespace CRMService.API.Setups;

public static class ServiceFactory
{
    public static void InstallServices(this WebApplicationBuilder builder)
    {
        var setups = typeof(ServiceFactory).Assembly
            .GetTypes()
            .Where(t => typeof(IServiceSetup).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract)
            .Select(Activator.CreateInstance)
            .Cast<IServiceSetup>();

        foreach (var setup in setups)
            setup.Install(builder.Services, builder.Configuration);
    }
}
