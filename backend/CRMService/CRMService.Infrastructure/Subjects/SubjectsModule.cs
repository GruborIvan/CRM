using CRMService.Domain.Subjects;
using Microsoft.Extensions.DependencyInjection;

namespace CRMService.Infrastructure.Subjects;

public static class SubjectsModule
{
    public static IServiceCollection AddSubjectsModule(this IServiceCollection services)
    {
        services.AddScoped<ISubjectRepository, SubjectRepository>();
        return services;
    }
}
