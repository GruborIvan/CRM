using CRMService.Domain.Contacts;
using CRMService.Domain.Idents;
using CRMService.Domain.Subjects;
using CRMService.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace CRMService.Infrastructure.Persistence;

public class CrmDbContext : DbContext
{
    public CrmDbContext(DbContextOptions<CrmDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<Ident> Idents => Set<Ident>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CrmDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}
