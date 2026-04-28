namespace CRMService.API.Setups;

public class ControllersSetup : IServiceSetup
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddControllers();
        services.AddEndpointsApiExplorer();
    }
}
