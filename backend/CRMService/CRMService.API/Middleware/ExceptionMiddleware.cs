using CRMService.Application.Common.Exceptions;
using System.Text.Json;

namespace CRMService.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var (status, error) = Classify(ex);

            if (status >= 500)
                _logger.LogError(ex, "Unhandled {ExceptionType} on {Method} {Path}",
                    ex.GetType().Name, context.Request.Method, context.Request.Path);
            else
                _logger.LogWarning("{ExceptionType} on {Method} {Path}: {Message}",
                    ex.GetType().Name, context.Request.Method, context.Request.Path, ex.Message);

            context.Response.StatusCode = status;
            context.Response.ContentType = "application/json";

            var body = JsonSerializer.Serialize(new { error, message = ex.Message });
            await context.Response.WriteAsync(body);
        }
    }

    private static (int Status, string Error) Classify(Exception ex) => ex switch
    {
        UnauthorizedException => (StatusCodes.Status401Unauthorized, "Unauthorized"),
        ConflictException     => (StatusCodes.Status409Conflict, "Conflict"),
        KeyNotFoundException  => (StatusCodes.Status404NotFound, "Not Found"),
        ArgumentException     => (StatusCodes.Status400BadRequest, "Bad Request"),
        _                     => (StatusCodes.Status500InternalServerError, "Internal Server Error")
    };
}
