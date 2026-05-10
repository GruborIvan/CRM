using CRMService.Domain.Common;

namespace CRMService.Domain.Idents;

public class Ident : BaseEntity
{
    public IdentType Type { get; private set; }
    public string Value { get; private set; } = string.Empty;
    public Guid CompanyId { get; private set; }

    private Ident() { }

    public static Ident Create(IdentType type, string value, Guid companyId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        return new Ident { Type = type, Value = value, CompanyId = companyId };
    }

    public void Update(IdentType type, string value)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(value);
        Type = type;
        Value = value;
        MarkUpdated();
    }
}
