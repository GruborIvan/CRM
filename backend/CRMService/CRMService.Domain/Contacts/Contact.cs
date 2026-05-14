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

    public void Update(string? firstName, string? lastName, string? email, string? phone)
    {
        if (firstName is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
            FirstName = firstName;
        }
        if (lastName is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
            LastName = lastName;
        }
        if (email is not null)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(email);
            Email = email;
        }
        if (phone is not null)
            Phone = phone;

        MarkUpdated();
    }
}
