using CRMService.Domain.Common;

namespace CRMService.Domain.Contacts;

public class Contact : BaseEntity
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public Guid? CompanyId { get; private set; }

    private Contact() { }

    public static Contact Create(string firstName, string lastName, string email, string phone, Guid? companyId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);

        return new Contact
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone,
            CompanyId = companyId
        };
    }

    public void Update(string firstName, string lastName, string email, string phone)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);

        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Phone = phone;
        MarkUpdated();
    }
}
