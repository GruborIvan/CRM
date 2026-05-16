using CRMService.Application.Contacts;
using CRMService.Application.Contacts.DTOs;
using CRMService.Domain.Contacts;
using Moq;

namespace CRMService.UnitTests.Contacts;

public class ContactServiceTests
{
    private readonly Mock<IContactRepository> _repository = new();
    private readonly ContactService _sut;

    public ContactServiceTests()
    {
        _sut = new ContactService(_repository.Object);
    }

    private static Contact MakeContact(
        string firstName = "John",
        string lastName = "Doe",
        string email = "john@example.com",
        string phone = "+123",
        Guid? companyId = null)
        => Contact.Create(firstName, lastName, email, phone, companyId);

    // ── UpdateAsync — empty body guard ───────────────────────────────────────

    [Fact]
    public async Task UpdateAsync_WhenAllFieldsNull_ThrowsArgumentException()
    {
        var dto = new UpdateContactDto(null, null, null, null);

        await Assert.ThrowsAsync<ArgumentException>(
            () => _sut.UpdateAsync(Guid.NewGuid(), dto));
    }

    [Fact]
    public async Task UpdateAsync_WhenAllFieldsNull_DoesNotCallRepository()
    {
        var dto = new UpdateContactDto(null, null, null, null);

        try { await _sut.UpdateAsync(Guid.NewGuid(), dto); } catch (ArgumentException) { }

        _repository.Verify(r => r.GetByIdAsync(It.IsAny<Guid>(), default), Times.Never);
        _repository.Verify(r => r.UpdateAsync(It.IsAny<Contact>(), default), Times.Never);
    }

    // ── UpdateAsync — not found ──────────────────────────────────────────────

    [Fact]
    public async Task UpdateAsync_WhenContactNotFound_ThrowsKeyNotFoundException()
    {
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default))
            .ReturnsAsync((Contact?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(
            () => _sut.UpdateAsync(Guid.NewGuid(), new UpdateContactDto("Jane", null, null, null)));
    }

    [Fact]
    public async Task UpdateAsync_WhenContactNotFound_DoesNotCallUpdateAsync()
    {
        _repository.Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), default))
            .ReturnsAsync((Contact?)null);

        try { await _sut.UpdateAsync(Guid.NewGuid(), new UpdateContactDto("Jane", null, null, null)); }
        catch (KeyNotFoundException) { }

        _repository.Verify(r => r.UpdateAsync(It.IsAny<Contact>(), default), Times.Never);
    }

    // ── UpdateAsync — single field updates ──────────────────────────────────

    [Fact]
    public async Task UpdateAsync_WithOnlyFirstName_UpdatesFirstNameOnly()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        var result = await _sut.UpdateAsync(contact.Id, new UpdateContactDto("Jane", null, null, null));

        Assert.Equal("Jane", result.FirstName);
        Assert.Equal("Doe", result.LastName);
        Assert.Equal("john@example.com", result.Email);
        Assert.Equal("+123", result.Phone);
    }

    [Fact]
    public async Task UpdateAsync_WithOnlyLastName_UpdatesLastNameOnly()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        var result = await _sut.UpdateAsync(contact.Id, new UpdateContactDto(null, "Smith", null, null));

        Assert.Equal("John", result.FirstName);
        Assert.Equal("Smith", result.LastName);
        Assert.Equal("john@example.com", result.Email);
        Assert.Equal("+123", result.Phone);
    }

    [Fact]
    public async Task UpdateAsync_WithOnlyEmail_UpdatesEmailOnly()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        var result = await _sut.UpdateAsync(contact.Id, new UpdateContactDto(null, null, "new@example.com", null));

        Assert.Equal("John", result.FirstName);
        Assert.Equal("Doe", result.LastName);
        Assert.Equal("new@example.com", result.Email);
        Assert.Equal("+123", result.Phone);
    }

    [Fact]
    public async Task UpdateAsync_WithOnlyPhone_UpdatesPhoneOnly()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        var result = await _sut.UpdateAsync(contact.Id, new UpdateContactDto(null, null, null, "+999"));

        Assert.Equal("John", result.FirstName);
        Assert.Equal("Doe", result.LastName);
        Assert.Equal("john@example.com", result.Email);
        Assert.Equal("+999", result.Phone);
    }

    // ── UpdateAsync — full update ────────────────────────────────────────────

    [Fact]
    public async Task UpdateAsync_WithAllFields_UpdatesAllFields()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        var result = await _sut.UpdateAsync(contact.Id,
            new UpdateContactDto("Jane", "Smith", "jane@example.com", "+999"));

        Assert.Equal("Jane", result.FirstName);
        Assert.Equal("Smith", result.LastName);
        Assert.Equal("jane@example.com", result.Email);
        Assert.Equal("+999", result.Phone);
    }

    // ── UpdateAsync — repository interaction ────────────────────────────────

    [Fact]
    public async Task UpdateAsync_WithValidUpdate_CallsRepositoryUpdateAsync()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        await _sut.UpdateAsync(contact.Id, new UpdateContactDto("Jane", null, null, null));

        _repository.Verify(r => r.UpdateAsync(
            It.Is<Contact>(c => c.Id == contact.Id && c.FirstName == "Jane"),
            default), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_WithValidUpdate_DoesNotCallAddAsync()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        await _sut.UpdateAsync(contact.Id, new UpdateContactDto("Jane", null, null, null));

        _repository.Verify(r => r.AddAsync(It.IsAny<Contact>(), default), Times.Never);
    }

    // ── UpdateAsync — returned DTO ───────────────────────────────────────────

    [Fact]
    public async Task UpdateAsync_ReturnsDtoWithContactId()
    {
        var contact = MakeContact();
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        var result = await _sut.UpdateAsync(contact.Id, new UpdateContactDto("Jane", null, null, null));

        Assert.Equal(contact.Id, result.Id);
    }

    [Fact]
    public async Task UpdateAsync_PreservesUnchangedFieldsInReturnedDto()
    {
        var companyId = Guid.NewGuid();
        var contact = MakeContact(companyId: companyId);
        _repository.Setup(r => r.GetByIdAsync(contact.Id, default)).ReturnsAsync(contact);

        var result = await _sut.UpdateAsync(contact.Id, new UpdateContactDto("Jane", null, null, null));

        Assert.Equal(companyId, result.CompanyId);
        Assert.Equal("Doe", result.LastName);
        Assert.Equal("john@example.com", result.Email);
        Assert.Equal("+123", result.Phone);
    }

}
