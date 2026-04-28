using CRMService.Domain.Common;

namespace CRMService.Domain.Contacts;

public class Contact : BaseEntity
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string Phone { get; private set; } = string.Empty;
    public Guid SubjectId { get; private set; }

    private Contact() { }

    public static Contact Create(string firstName, string lastName, string email, string phone, Guid subjectId)
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
            SubjectId = subjectId
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
