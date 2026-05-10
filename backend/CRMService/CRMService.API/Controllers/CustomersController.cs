using CRMService.Application.Customers;
using CRMService.Application.Customers.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CRMService.API.Controllers;

[ApiController]
[Route("customers")]
//[Authorize]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _customerService;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(ICustomerService customerService, ILogger<CustomersController> logger)
    {
        _customerService = customerService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        _logger.LogInformation("GET /customers by {User}", User.Identity?.Name);
        var customers = await _customerService.GetAllAsync(ct);
        return Ok(customers);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCustomerDto dto, CancellationToken ct)
    {
        _logger.LogInformation("POST /customers by {User}", User.Identity?.Name);
        var customer = await _customerService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetAll), new { id = customer.Id }, customer);
    }

    [HttpGet("me")]
    public IActionResult WhoAmI()
    {
        var username = User.FindFirstValue(ClaimTypes.Name);
        return Ok(new { loggedInAs = username });
    }
}
