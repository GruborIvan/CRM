namespace CRMService.API.Setups;

public interface IServiceSetup
{
    void Install(IServiceCollection services, IConfiguration configuration);
}
