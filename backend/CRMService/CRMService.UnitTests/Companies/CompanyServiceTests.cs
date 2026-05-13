using CRMService.Application.Companies;
using CRMService.Application.Companies.DTOs;
using CRMService.Domain.Companies;
using Moq;

namespace CRMService.UnitTests.Companies;

public class CompanyServiceTests
{
    private readonly Mock<ICompanyRepository> _repository = new();
    private readonly CompanyService _sut;

    public CompanyServiceTests()
    {
        _sut = new CompanyService(_repository.Object);
    }

    // ── GetAllAsync ──────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAllAsync_ReturnsAllCompaniesAsDtos()
    {
        var companies = new List<Company>
        {
            Company.Create("Acme Corp", CompanyStatus.Customer, email: "acme@example.com"),
            Company.Create("Beta Ltd", CompanyStatus.Lead)
        };
        _repository.Setup(r => r.GetAllAsync(default)).ReturnsAsync(companies);

        var result = (await _sut.GetAllAsync()).ToList();

        Assert.Equal(2, result.Count);
        Assert.Contains(result, d => d.Name == "Acme Corp" && d.Email == "acme@example.com");
        Assert.Contains(result, d => d.Name == "Beta Ltd" && d.Status == CompanyStatus.Lead);
    }

    [Fact]
    public async Task GetAllAsync_WhenEmpty_ReturnsEmptyCollection()
    {
        _repository.Setup(r => r.GetAllAsync(default)).ReturnsAsync([]);

        var result = await _sut.GetAllAsync();

        Assert.Empty(result);
    }

    [Fact]
    public async Task GetAllAsync_MapsAllFieldsToDto()
    {
        var company = Company.Create(
            "Acme Corp", CompanyStatus.Prospect,
            "hello@acme.com", "+123", "https://acme.com",
            "London", "1 Main St", "Tech", "VIP client");
        _repository.Setup(r => r.GetAllAsync(default)).ReturnsAsync([company]);

        var result = (await _sut.GetAllAsync()).Single();

        Assert.Equal(company.Id, result.Id);
        Assert.Equal("Acme Corp", result.Name);
        Assert.Equal(CompanyStatus.Prospect, result.Status);
        Assert.Equal("hello@acme.com", result.Email);
        Assert.Equal("+123", result.Phone);
        Assert.Equal("https://acme.com", result.Website);
        Assert.Equal("London", result.City);
        Assert.Equal("1 Main St", result.Address);
        Assert.Equal("Tech", result.Industry);
        Assert.Equal("VIP client", result.Notes);
        Assert.Equal(company.CreatedAt, result.CreatedAt);
        Assert.Equal(company.UpdatedAt, result.UpdatedAt);
    }

    // ── GetByIdAsync ─────────────────────────────────────────────────────────

    [Fact]
    public async Task GetByIdAsync_WhenFound_ReturnsDto()
    {
        var company = Company.Create("Acme Corp", CompanyStatus.Customer);
        _repository.Setup(r => r.GetWithDetailsAsync(company.Id, default)).ReturnsAsync(company);

        var result = await _sut.GetByIdAsync(company.Id);

        Assert.NotNull(result);
        Assert.Equal(company.Id, result.Id);
        Assert.Equal("Acme Corp", result.Name);
        Assert.Equal(CompanyStatus.Customer, result.Status);
    }

    [Fact]
    public async Task GetByIdAsync_WhenFound_ReturnsEmptyContactsList()
    {
        var company = Company.Create("Acme Corp", CompanyStatus.Customer);
        _repository.Setup(r => r.GetWithDetailsAsync(company.Id, default)).ReturnsAsync(company);

        var result = await _sut.GetByIdAsync(company.Id);

        Assert.NotNull(result!.Contacts);
        Assert.Empty(result.Contacts);
    }

    [Fact]
    public async Task GetByIdAsync_WhenNotFound_ReturnsNull()
    {
        _repository.Setup(r => r.GetWithDetailsAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Company?)null);

        var result = await _sut.GetByIdAsync(Guid.NewGuid());

        Assert.Null(result);
    }

    // ── CreateAsync ──────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateAsync_ReturnsNewCompanyDto()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Lead,
            "acme@example.com", "+1234", null, "London", "1 Main St", "Tech", null);

        var result = await _sut.CreateAsync(dto);

        Assert.Equal("Acme Corp", result.Name);
        Assert.Equal(CompanyStatus.Lead, result.Status);
        Assert.Equal("acme@example.com", result.Email);
        Assert.Equal("London", result.City);
        Assert.NotEqual(Guid.Empty, result.Id);
    }

    [Fact]
    public async Task CreateAsync_MapsAllOptionalFieldsToDto()
    {
        var dto = new CreateCompanyDto(
            "Acme Corp", CompanyStatus.Prospect,
            "hello@acme.com", "+123", "https://acme.com",
            "London", "1 Main St", "Tech", "VIP client");

        var result = await _sut.CreateAsync(dto);

        Assert.Equal("hello@acme.com", result.Email);
        Assert.Equal("+123", result.Phone);
        Assert.Equal("https://acme.com", result.Website);
        Assert.Equal("London", result.City);
        Assert.Equal("1 Main St", result.Address);
        Assert.Equal("Tech", result.Industry);
        Assert.Equal("VIP client", result.Notes);
    }

    [Fact]
    public async Task CreateAsync_CallsAddAsyncOnRepository()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Customer,
            null, null, null, null, null, null, null);

        await _sut.CreateAsync(dto);

        _repository.Verify(r => r.AddAsync(
            It.Is<Company>(c => c.Name == "Acme Corp" && c.Status == CompanyStatus.Customer),
            default), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_NullOptionalFields_DoNotThrow()
    {
        var dto = new CreateCompanyDto("Acme Corp", CompanyStatus.Lead,
            null, null, null, null, null, null, null);

        var result = await _sut.CreateAsync(dto);

        Assert.Null(result.Email);
        Assert.Null(result.Phone);
        Assert.Null(result.Website);
        Assert.Null(result.City);
        Assert.Null(result.Address);
        Assert.Null(result.Industry);
        Assert.Null(result.Notes);
    }

    // ── UpdateAsync ──────────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateAsync_WhenFound_ReturnsUpdatedDto()
    {
        var company = Company.Create("Old Name", CompanyStatus.Lead);
        _repository.Setup(r => r.GetByIdAsync(company.Id, default)).ReturnsAsync(company);
        var dto = new UpdateCompanyDto("New Name", CompanyStatus.Customer,
            "new@test.com", null, null, "Berlin", null, null, null);

        var result = await _sut.UpdateAsync(company.Id, dto);

        Assert.Equal("New Name", result.Name);
        Assert.Equal(CompanyStatus.Customer, result.Status);
        Assert.Equal("new@test.com", result.Email);
        Assert.Equal("Berlin", result.City);
    }

    [Fact]
    public async Task UpdateAsync_WhenNotFound_ThrowsKeyNotFoundException()
    {
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default)).ReturnsAsync((Company?)null);
        var dto = new UpdateCompanyDto("Name", CompanyStatus.Customer,
            null, null, null, null, null, null, null);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _sut.UpdateAsync(Guid.NewGuid(), dto));
    }

    [Fact]
    public async Task UpdateAsync_WhenFound_CallsUpdateAsyncOnRepository()
    {
        var company = Company.Create("Old Name", CompanyStatus.Lead);
        _repository.Setup(r => r.GetByIdAsync(company.Id, default)).ReturnsAsync(company);

        await _sut.UpdateAsync(company.Id,
            new UpdateCompanyDto("New Name", CompanyStatus.Customer, null, null, null, null, null, null, null));

        _repository.Verify(r => r.UpdateAsync(
            It.Is<Company>(c => c.Name == "New Name" && c.Status == CompanyStatus.Customer),
            default), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_DoesNotCallAddAsync()
    {
        var company = Company.Create("Old Name", CompanyStatus.Lead);
        _repository.Setup(r => r.GetByIdAsync(company.Id, default)).ReturnsAsync(company);

        await _sut.UpdateAsync(company.Id,
            new UpdateCompanyDto("New Name", CompanyStatus.Customer, null, null, null, null, null, null, null));

        _repository.Verify(r => r.AddAsync(It.IsAny<Company>(), default), Times.Never);
    }

    // ── DeleteAsync ──────────────────────────────────────────────────────────

    [Fact]
    public async Task DeleteAsync_CallsRepositoryDeleteAsync()
    {
        var id = Guid.NewGuid();

        await _sut.DeleteAsync(id);

        _repository.Verify(r => r.DeleteAsync(id, default), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_DoesNotCallOtherRepositoryMethods()
    {
        await _sut.DeleteAsync(Guid.NewGuid());

        _repository.Verify(r => r.AddAsync(It.IsAny<Company>(), default), Times.Never);
        _repository.Verify(r => r.UpdateAsync(It.IsAny<Company>(), default), Times.Never);
    }
}
