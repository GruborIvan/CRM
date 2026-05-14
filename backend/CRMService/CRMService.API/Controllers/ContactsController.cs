using CRMService.Application.Contacts;
using CRMService.Application.Contacts.DTOs;
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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactDto dto, CancellationToken ct)
    {
        var contact = await _contactService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetAll), new { id = contact.Id }, contact);
    }

    [HttpPatch("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateContactDto dto, CancellationToken ct)
    {
        var contact = await _contactService.UpdateAsync(id, dto, ct);
        return Ok(contact);
    }
}
