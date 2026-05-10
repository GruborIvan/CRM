using CRMService.Domain.Common;
using CRMService.Domain.Contacts;
using CRMService.Domain.Idents;

namespace CRMService.Domain.Companies;

public class Company : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? Email { get; private set; }
    public string? Phone { get; private set; }
    public string? Website { get; private set; }
    public string? City { get; private set; }
    public string? Address { get; private set; }
    public string? Industry { get; private set; }
    public string? Notes { get; private set; }
    public CompanyStatus Status { get; private set; }

    private readonly List<Contact> _contacts = [];
    public IReadOnlyCollection<Contact> Contacts => _contacts.AsReadOnly();

    private readonly List<Ident> _idents = [];
    public IReadOnlyCollection<Ident> Idents => _idents.AsReadOnly();

    private Company() { }

    public static Company Create(
        string name,
        CompanyStatus status,
        string? email = null,
        string? phone = null,
        string? website = null,
        string? city = null,
        string? address = null,
        string? industry = null,
        string? notes = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new Company
        {
            Name = name,
            Status = status,
            Email = email,
            Phone = phone,
            Website = website,
            City = city,
            Address = address,
            Industry = industry,
            Notes = notes
        };
    }

    public void Update(
        string name,
        CompanyStatus status,
        string? email,
        string? phone,
        string? website,
        string? city,
        string? address,
        string? industry,
        string? notes)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        Name = name;
        Status = status;
        Email = email;
        Phone = phone;
        Website = website;
        City = city;
        Address = address;
        Industry = industry;
        Notes = notes;
        MarkUpdated();
    }
}
