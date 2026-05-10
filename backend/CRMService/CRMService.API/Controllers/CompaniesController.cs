using CRMService.Application.Companies;
using CRMService.Application.Companies.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CRMService.API.Controllers;

[ApiController]
[Route("companies")]
//[Authorize]
public class CompaniesController : ControllerBase
{
    private readonly ICompanyService _companyService;
    private readonly ILogger<CompaniesController> _logger;

    public CompaniesController(ICompanyService companyService, ILogger<CompaniesController> logger)
    {
        _companyService = companyService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        _logger.LogInformation("GET /companies by {User}", User.Identity?.Name);
        var companies = await _companyService.GetAllAsync(ct);
        return Ok(companies);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        _logger.LogInformation("GET /companies/{Id} by {User}", id, User.Identity?.Name);
        var company = await _companyService.GetByIdAsync(id, ct);
        if (company is null) return NotFound();
        return Ok(company);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCompanyDto dto, CancellationToken ct)
    {
        _logger.LogInformation("POST /companies by {User}", User.Identity?.Name);
        var company = await _companyService.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetAll), new { id = company.Id }, company);
    }
}
