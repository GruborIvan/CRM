using CRMService.Domain.Companies;

namespace CRMService.UnitTests.Companies;

public class CompanyEntityTests
{
    [Fact]
    public void Create_WithRequiredFieldsOnly_SetsFieldsAndDefaultsOptionalToNull()
    {
        var company = Company.Create("Acme Corp", CompanyStatus.Lead);

        Assert.Equal("Acme Corp", company.Name);
        Assert.Equal(CompanyStatus.Lead, company.Status);
        Assert.NotEqual(Guid.Empty, company.Id);
        Assert.True(company.CreatedAt <= DateTime.UtcNow);
        Assert.Null(company.UpdatedAt);
        Assert.Null(company.Email);
        Assert.Null(company.Phone);
        Assert.Null(company.Website);
        Assert.Null(company.City);
        Assert.Null(company.Address);
        Assert.Null(company.Industry);
        Assert.Null(company.Notes);
    }

    [Fact]
    public void Create_WithAllFields_SetsEveryField()
    {
        var company = Company.Create(
            "Acme Corp", CompanyStatus.Active,
            "hello@acme.com", "+1234567890", "https://acme.com",
            "London", "1 Main St", "Technology", "Key account");

        Assert.Equal("Acme Corp", company.Name);
        Assert.Equal(CompanyStatus.Active, company.Status);
        Assert.Equal("hello@acme.com", company.Email);
        Assert.Equal("+1234567890", company.Phone);
        Assert.Equal("https://acme.com", company.Website);
        Assert.Equal("London", company.City);
        Assert.Equal("1 Main St", company.Address);
        Assert.Equal("Technology", company.Industry);
        Assert.Equal("Key account", company.Notes);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Create_WithBlankName_ThrowsArgumentException(string name)
    {
        Assert.Throws<ArgumentException>(() => Company.Create(name, CompanyStatus.Lead));
    }

    [Theory]
    [InlineData(CompanyStatus.Lead)]
    [InlineData(CompanyStatus.Prospect)]
    [InlineData(CompanyStatus.Active)]
    [InlineData(CompanyStatus.Inactive)]
    [InlineData(CompanyStatus.Churned)]
    public void Create_WithAnyStatus_SetsStatusCorrectly(CompanyStatus status)
    {
        var company = Company.Create("Test Co", status);

        Assert.Equal(status, company.Status);
    }

    [Fact]
    public void Create_EachInstanceGetsUniqueId()
    {
        var a = Company.Create("A", CompanyStatus.Lead);
        var b = Company.Create("B", CompanyStatus.Lead);

        Assert.NotEqual(a.Id, b.Id);
    }

    [Fact]
    public void Update_WithValidData_UpdatesAllFields()
    {
        var company = Company.Create("Old Name", CompanyStatus.Lead, "old@test.com");

        company.Update("New Name", CompanyStatus.Active,
            "new@test.com", "+99", "https://new.com",
            "Berlin", "99 Strasse", "Finance", "Updated notes");

        Assert.Equal("New Name", company.Name);
        Assert.Equal(CompanyStatus.Active, company.Status);
        Assert.Equal("new@test.com", company.Email);
        Assert.Equal("+99", company.Phone);
        Assert.Equal("https://new.com", company.Website);
        Assert.Equal("Berlin", company.City);
        Assert.Equal("99 Strasse", company.Address);
        Assert.Equal("Finance", company.Industry);
        Assert.Equal("Updated notes", company.Notes);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithBlankName_ThrowsArgumentException(string name)
    {
        var company = Company.Create("Acme Corp", CompanyStatus.Lead);

        Assert.Throws<ArgumentException>(() =>
            company.Update(name, CompanyStatus.Active, null, null, null, null, null, null, null));
    }

    [Fact]
    public void Update_SetsUpdatedAt()
    {
        var company = Company.Create("Acme Corp", CompanyStatus.Lead);
        Assert.Null(company.UpdatedAt);

        company.Update("Acme Corp", CompanyStatus.Active, null, null, null, null, null, null, null);

        Assert.NotNull(company.UpdatedAt);
        Assert.True(company.UpdatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public void Update_ClearsOptionalFieldsWhenPassedNull()
    {
        var company = Company.Create("Acme Corp", CompanyStatus.Lead,
            "email@test.com", "+123", "https://acme.com", "London", "1 Main St", "Tech", "Notes");

        company.Update("Acme Corp", CompanyStatus.Lead, null, null, null, null, null, null, null);

        Assert.Null(company.Email);
        Assert.Null(company.Phone);
        Assert.Null(company.Website);
        Assert.Null(company.City);
        Assert.Null(company.Address);
        Assert.Null(company.Industry);
        Assert.Null(company.Notes);
    }

    [Fact]
    public void Update_DoesNotChangeId()
    {
        var company = Company.Create("Acme Corp", CompanyStatus.Lead);
        var originalId = company.Id;

        company.Update("New Name", CompanyStatus.Active, null, null, null, null, null, null, null);

        Assert.Equal(originalId, company.Id);
    }
}
