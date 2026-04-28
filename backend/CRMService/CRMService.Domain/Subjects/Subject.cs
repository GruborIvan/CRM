using CRMService.Domain.Common;
using CRMService.Domain.Contacts;
using CRMService.Domain.Idents;

namespace CRMService.Domain.Subjects;

public class Subject : BaseEntity
{
    public string Name { get; private set; } = string.Empty;
    public string? TaxNumber { get; private set; }
    public string? Address { get; private set; }

    private readonly List<Contact> _contacts = [];
    public IReadOnlyCollection<Contact> Contacts => _contacts.AsReadOnly();

    private readonly List<Ident> _idents = [];
    public IReadOnlyCollection<Ident> Idents => _idents.AsReadOnly();

    private Subject() { }

    public static Subject Create(string name, string? taxNumber = null, string? address = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new Subject { Name = name, TaxNumber = taxNumber, Address = address };
    }

    public void Update(string name, string? taxNumber, string? address)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        Name = name;
        TaxNumber = taxNumber;
        Address = address;
        MarkUpdated();
    }
}
