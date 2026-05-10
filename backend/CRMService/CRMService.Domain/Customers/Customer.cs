using CRMService.Domain.Common;

namespace CRMService.Domain.Customers;

public class Customer : BaseEntity
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string? Phone { get; private set; }
    public string? Company { get; private set; }
    public string? JobTitle { get; private set; }
    public string? Address { get; private set; }
    public string? Language { get; private set; }

    private Customer() { }

    public static Customer Create(
        string firstName,
        string lastName,
        string email,
        string? phone = null,
        string? company = null,
        string? jobTitle = null,
        string? address = null,
        string? language = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);

        return new Customer
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone,
            Company = company,
            JobTitle = jobTitle,
            Address = address,
            Language = language
        };
    }

    public void Update(
        string firstName,
        string lastName,
        string email,
        string? phone,
        string? company,
        string? jobTitle,
        string? address,
        string? language)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(firstName);
        ArgumentException.ThrowIfNullOrWhiteSpace(lastName);
        ArgumentException.ThrowIfNullOrWhiteSpace(email);

        FirstName = firstName;
        LastName = lastName;
        Email = email;
        Phone = phone;
        Company = company;
        JobTitle = jobTitle;
        Address = address;
        Language = language;
        MarkUpdated();
    }
}
