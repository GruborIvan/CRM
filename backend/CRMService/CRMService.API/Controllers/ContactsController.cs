using CRMService.Application.Contacts;
using Microsoft.AspNetCore.Mvc;

namespace CRMService.API.Controllers;

[ApiController]
[Route("contacts")]
//[Authorize]
public class ContactsController : ControllerBase
{
    private readonly IContactService _contactService;
    private readonly ILogger<ContactsController> _logger;

    public ContactsController(IContactService contactService, ILogger<ContactsController> logger)
    {
        _contactService = contactService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        _logger.LogInformation("GET /contacts by {User}", User.Identity?.Name);
        var contacts = await _contactService.GetAllAsync(ct);
        return Ok(contacts);
    }
}
