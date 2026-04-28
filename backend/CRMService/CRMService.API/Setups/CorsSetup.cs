namespace CRMService.API.Setups;

public class CorsSetup : IServiceSetup
{
    public const string PolicyName = "CrmCorsPolicy";

    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

        services.AddCors(options =>
        {
            options.AddPolicy(PolicyName, policy =>
            {
                if (origins.Length > 0)
                    policy.WithOrigins(origins);
                else
                    policy.AllowAnyOrigin();

                policy
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
        });
    }
}
