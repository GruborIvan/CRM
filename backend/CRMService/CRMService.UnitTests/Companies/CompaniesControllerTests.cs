using CRMService.API.Controllers;
using CRMService.Application.Companies;
using CRMService.Application.Companies.DTOs;
using CRMService.Domain.Companies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace CRMService.UnitTests.Companies;

public class CompaniesControllerTests
{
    private readonly Mock<ICompanyService> _service = new();
    private readonly CompaniesController _sut;

    private static CompanyDto MakeDto(
        string name = "Acme Corp",
        CompanyStatus status = CompanyStatus.Active) => new(
            Guid.NewGuid(), name, null, null, null, null, null, null, null,
            status, DateTime.UtcNow, null);

    public CompaniesControllerTests()
    {
        _sut = new CompaniesController(_service.Object, Mock.Of<ILogger<CompaniesController>>())
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            }
        };
    }

    // ── GET /companies ───────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_ReturnsOkResult()
    {
        _service.Setup(s => s.GetAllAsync(default)).ReturnsAsync([]);

        var result = await _sut.GetAll(default);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetAll_ReturnsServiceResponse()
    {
        var companies = new List<CompanyDto> { MakeDto("Acme"), MakeDto("Beta") };
        _service.Setup(s => s.GetAllAsync(default)).ReturnsAsync(companies);

        var result = await _sut.GetAll(default);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(companies, ok.Value);
    }

    [Fact]
    public async Task GetAll_WhenNoCompanies_ReturnsOkWithEmptyList()
    {
        _service.Setup(s => s.GetAllAsync(default)).ReturnsAsync([]);

        var result = await _sut.GetAll(default);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Empty((IEnumerable<CompanyDto>)ok.Value!);
    }

    [Fact]
    public async Task GetAll_CallsServiceOnce()
    {
        _service.Setup(s => s.GetAllAsync(default)).ReturnsAsync([]);

        await _sut.GetAll(default);

        _service.Verify(s => s.GetAllAsync(default), Times.Once);
    }

    // ── GET /companies/{id} ──────────────────────────────────────────────────

    [Fact]
    public async Task GetById_WhenFound_ReturnsOkResult()
    {
        var dto = MakeDto();
        _service.Setup(s => s.GetByIdAsync(dto.Id, default)).ReturnsAsync(dto);

        var result = await _sut.GetById(dto.Id, default);

        Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetById_WhenFound_ReturnsCompanyDto()
    {
        var dto = MakeDto("Acme Corp");
        _service.Setup(s => s.GetByIdAsync(dto.Id, default)).ReturnsAsync(dto);

        var result = await _sut.GetById(dto.Id, default);

        var ok = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(dto, ok.Value);
    }

    [Fact]
    public async Task GetById_WhenNotFound_ReturnsNotFound()
    {
        _service.Setup(s => s.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((CompanyDto?)null);

        var result = await _sut.GetById(Guid.NewGuid(), default);

        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task GetById_CallsServiceWithCorrectId()
    {
        var id = Guid.NewGuid();
        _service.Setup(s => s.GetByIdAsync(id, default)).ReturnsAsync(MakeDto());

        await _sut.GetById(id, default);

        _service.Verify(s => s.GetByIdAsync(id, default), Times.Once);
    }

    // ── POST /companies ──────────────────────────────────────────────────────

    [Fact]
    public async Task Create_ReturnsCreatedAtActionResult()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Lead,
            null, null, null, null, null, null, null);
        _service.Setup(s => s.CreateAsync(dto, default)).ReturnsAsync(MakeDto());

        var result = await _sut.Create(dto, default);

        Assert.IsType<CreatedAtActionResult>(result);
    }

    [Fact]
    public async Task Create_Returns201StatusCode()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Lead,
            null, null, null, null, null, null, null);
        _service.Setup(s => s.CreateAsync(dto, default)).ReturnsAsync(MakeDto());

        var result = await _sut.Create(dto, default);

        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(StatusCodes.Status201Created, created.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsCompanyDtoAsBody()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Lead,
            null, null, null, null, null, null, null);
        var expected = MakeDto("Acme Corp");
        _service.Setup(s => s.CreateAsync(dto, default)).ReturnsAsync(expected);

        var result = await _sut.Create(dto, default);

        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(expected, created.Value);
    }

    [Fact]
    public async Task Create_SetsIdInRouteValues()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Lead,
            null, null, null, null, null, null, null);
        var expected = MakeDto();
        _service.Setup(s => s.CreateAsync(dto, default)).ReturnsAsync(expected);

        var result = await _sut.Create(dto, default);

        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(expected.Id, created.RouteValues!["id"]);
    }

    [Fact]
    public async Task Create_CallsServiceWithExactDto()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Prospect,
            "hello@acme.com", "+123", "https://acme.com", "London", "1 Main St", "Tech", "Notes");
        _service.Setup(s => s.CreateAsync(dto, default)).ReturnsAsync(MakeDto());

        await _sut.Create(dto, default);

        _service.Verify(s => s.CreateAsync(dto, default), Times.Once);
    }

    [Fact]
    public async Task Create_PointsCreatedAtActionToGetAll()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Lead,
            null, null, null, null, null, null, null);
        _service.Setup(s => s.CreateAsync(dto, default)).ReturnsAsync(MakeDto());

        var result = await _sut.Create(dto, default);

        var created = Assert.IsType<CreatedAtActionResult>(result);
        Assert.Equal(nameof(_sut.GetAll), created.ActionName);
    }
}
