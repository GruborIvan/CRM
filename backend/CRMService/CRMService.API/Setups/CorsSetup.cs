namespace CRMService.API.Setups;

public class CorsSetup : IServiceSetup
{
    public const string PolicyName = "CrmCorsPolicy";

    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
    }
}
