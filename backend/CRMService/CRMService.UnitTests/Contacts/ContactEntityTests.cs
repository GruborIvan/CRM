using CRMService.Domain.Contacts;

namespace CRMService.UnitTests.Contacts;

public class ContactEntityTests
{
    private static Contact MakeContact(
        string firstName = "John",
        string lastName = "Doe",
        string email = "john@example.com",
        string phone = "+123",
        Guid? companyId = null)
        => Contact.Create(firstName, lastName, email, phone, companyId);

    // ── Create ───────────────────────────────────────────────────────────────

    [Fact]
    public void Create_WithValidData_SetsAllProperties()
    {
        var companyId = Guid.NewGuid();
        var contact = Contact.Create("Jane", "Smith", "jane@example.com", "+456", companyId);

        Assert.Equal("Jane", contact.FirstName);
        Assert.Equal("Smith", contact.LastName);
        Assert.Equal("jane@example.com", contact.Email);
        Assert.Equal("+456", contact.Phone);
        Assert.Equal(companyId, contact.CompanyId);
        Assert.NotEqual(Guid.Empty, contact.Id);
    }

    [Theory]
    [InlineData("", "Doe", "john@example.com")]
    [InlineData("   ", "Doe", "john@example.com")]
    [InlineData("John", "", "john@example.com")]
    [InlineData("John", "   ", "john@example.com")]
    [InlineData("John", "Doe", "")]
    [InlineData("John", "Doe", "   ")]
    public void Create_WithBlankRequiredField_ThrowsArgumentException(
        string firstName, string lastName, string email)
    {
        Assert.Throws<ArgumentException>(
            () => Contact.Create(firstName, lastName, email, "+123"));
    }

    [Fact]
    public void Create_WithoutCompanyId_LeavesCompanyIdNull()
    {
        var contact = Contact.Create("John", "Doe", "john@example.com", "+123");

        Assert.Null(contact.CompanyId);
    }

    // ── Update — selective field application ─────────────────────────────────

    [Fact]
    public void Update_WithOnlyFirstName_UpdatesFirstNameOnly()
    {
        var contact = MakeContact();

        contact.Update("Jane", null, null, null);

        Assert.Equal("Jane", contact.FirstName);
        Assert.Equal("Doe", contact.LastName);
        Assert.Equal("john@example.com", contact.Email);
        Assert.Equal("+123", contact.Phone);
    }

    [Fact]
    public void Update_WithOnlyLastName_UpdatesLastNameOnly()
    {
        var contact = MakeContact();

        contact.Update(null, "Smith", null, null);

        Assert.Equal("John", contact.FirstName);
        Assert.Equal("Smith", contact.LastName);
        Assert.Equal("john@example.com", contact.Email);
        Assert.Equal("+123", contact.Phone);
    }

    [Fact]
    public void Update_WithOnlyEmail_UpdatesEmailOnly()
    {
        var contact = MakeContact();

        contact.Update(null, null, "newemail@example.com", null);

        Assert.Equal("John", contact.FirstName);
        Assert.Equal("Doe", contact.LastName);
        Assert.Equal("newemail@example.com", contact.Email);
        Assert.Equal("+123", contact.Phone);
    }

    [Fact]
    public void Update_WithOnlyPhone_UpdatesPhoneOnly()
    {
        var contact = MakeContact();

        contact.Update(null, null, null, "+999");

        Assert.Equal("John", contact.FirstName);
        Assert.Equal("Doe", contact.LastName);
        Assert.Equal("john@example.com", contact.Email);
        Assert.Equal("+999", contact.Phone);
    }

    [Fact]
    public void Update_WithAllFields_UpdatesAllFields()
    {
        var contact = MakeContact();

        contact.Update("Jane", "Smith", "jane@example.com", "+999");

        Assert.Equal("Jane", contact.FirstName);
        Assert.Equal("Smith", contact.LastName);
        Assert.Equal("jane@example.com", contact.Email);
        Assert.Equal("+999", contact.Phone);
    }

    [Fact]
    public void Update_WithTwoFields_UpdatesOnlyThoseTwo()
    {
        var contact = MakeContact();

        contact.Update("Jane", null, "jane@example.com", null);

        Assert.Equal("Jane", contact.FirstName);
        Assert.Equal("Doe", contact.LastName);
        Assert.Equal("jane@example.com", contact.Email);
        Assert.Equal("+123", contact.Phone);
    }

    // ── Update — whitespace rejection ────────────────────────────────────────

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithWhitespaceFirstName_ThrowsArgumentException(string firstName)
    {
        var contact = MakeContact();

        Assert.Throws<ArgumentException>(() => contact.Update(firstName, null, null, null));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithWhitespaceLastName_ThrowsArgumentException(string lastName)
    {
        var contact = MakeContact();

        Assert.Throws<ArgumentException>(() => contact.Update(null, lastName, null, null));
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void Update_WithWhitespaceEmail_ThrowsArgumentException(string email)
    {
        var contact = MakeContact();

        Assert.Throws<ArgumentException>(() => contact.Update(null, null, email, null));
    }

    [Fact]
    public void Update_WithWhitespaceFirstName_DoesNotMutateState()
    {
        var contact = MakeContact();

        try { contact.Update("   ", null, null, null); } catch (ArgumentException) { }

        Assert.Equal("John", contact.FirstName);
    }

    // ── Update — UpdatedAt ───────────────────────────────────────────────────

    [Fact]
    public void Update_SetsUpdatedAt()
    {
        var contact = MakeContact();

        contact.Update("Jane", null, null, null);

        Assert.NotNull(contact.UpdatedAt);
    }

    [Fact]
    public void Update_WithAllNullFields_StillSetsUpdatedAt()
    {
        var contact = MakeContact();

        contact.Update(null, null, null, null);

        Assert.NotNull(contact.UpdatedAt);
    }
}
