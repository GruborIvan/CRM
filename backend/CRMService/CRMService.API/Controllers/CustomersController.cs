using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CRMService.API.Controllers;

[ApiController]
[Route("customers")]
[Authorize]
public class CustomersController : ControllerBase
{
    private static readonly List<CustomerDto> _customers =
    [
        new(1, "Marko Marković", "marko@example.com"),
        new(2, "Ana Anić", "ana@example.com"),
        new(3, "Ivan Ivanić", "ivan@example.com")
    ];

    [HttpGet]
    public IActionResult GetAll() => Ok(_customers);

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var customer = _customers.FirstOrDefault(c => c.Id == id);
        return customer is null ? NotFound() : Ok(customer);
    }

    [HttpGet("me")]
    public IActionResult WhoAmI()
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        return Ok(new { loggedInAs = username });
    }
}

public record CustomerDto(int Id, string Name, string Email);
