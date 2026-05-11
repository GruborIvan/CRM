using CRMService.Domain.Companies;
using CRMService.Domain.Contacts;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace CRMService.Infrastructure.Persistence;

public static class DevSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<CrmDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<CrmDbContext>>();

        try
        {
            logger.LogInformation("DevSeeder: checking database...");

            var existingNames = (await db.Companies.Select(c => c.Name).ToListAsync()).ToHashSet();

            var allCompanies = BuildCompanies();
            var newCompanies = allCompanies.Where(c => !existingNames.Contains(c.Name)).ToList();

            if (newCompanies.Count == 0)
            {
                logger.LogInformation("DevSeeder: all companies already exist, skipping.");
                return;
            }

            // Insert companies first so FK constraints are satisfied when contacts are saved
            db.Companies.AddRange(newCompanies);
            await db.SaveChangesAsync();

            var newIds = newCompanies.Select(c => c.Id).ToHashSet();
            var contacts = BuildContacts(allCompanies)
                .Where(c => c.CompanyId.HasValue && newIds.Contains(c.CompanyId.Value))
                .ToList();

            db.Contacts.AddRange(contacts);
            await db.SaveChangesAsync();

            logger.LogInformation("DevSeeder: seeded {CompanyCount} companies and {ContactCount} contacts",
                newCompanies.Count, contacts.Count);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "DevSeeder: failed to seed data");
            throw;
        }
    }

    private static List<Company> BuildCompanies() =>
    [
        Company.Create("FIS", CompanyStatus.Active,
            email: "office@fis.rs", phone: "+381 11 2011 000",
            website: "https://www.fis.rs", city: "Beograd",
            address: "Milentija Popovića 5b", industry: "Financial Technology"),

        Company.Create("Levi9", CompanyStatus.Active,
            email: "info@levi9.com", phone: "+381 21 4750 750",
            website: "https://www.levi9.com", city: "Novi Sad",
            address: "Bulevar oslobođenja 30", industry: "Software Development"),

        Company.Create("Mercator", CompanyStatus.Active,
            email: "kontakt@mercator.rs", phone: "+381 11 2200 800",
            website: "https://www.mercator.rs", city: "Beograd",
            address: "Tršćanska 15", industry: "Retail"),

        Company.Create("Connect Software Solutions", CompanyStatus.Active,
            email: "office@connect.rs", phone: "+381 11 3555 200",
            website: "https://www.connect.rs", city: "Beograd",
            address: "Vladimira Popovića 38-40", industry: "Software Development"),

        Company.Create("MK Group", CompanyStatus.Active,
            email: "info@mkgroup.rs", phone: "+381 21 4800 100",
            website: "https://www.mkgroup.rs", city: "Novi Sad",
            address: "Bulevar Mihajla Pupina 6", industry: "Holding"),

        Company.Create("GTS Adriatic", CompanyStatus.Active,
            email: "info@gtsadriatic.com", phone: "+381 11 3200 700",
            website: "https://www.gtsadriatic.com", city: "Beograd",
            address: "Omladinskih brigada 90b", industry: "IT Services"),
    ];

    private static List<Contact> BuildContacts(List<Company> companies)
    {
        var (fis, levi9, mercator, connect, mkGroup, gts) =
            (companies[0], companies[1], companies[2], companies[3], companies[4], companies[5]);

        return
        [
            // FIS — 3 contacts
            Contact.Create("Nikola",      "Petrović",   "nikola.petrovic@fis.rs",       "+381 64 100 1001", fis.Id),
            Contact.Create("Jelena",      "Marković",   "jelena.markovic@fis.rs",        "+381 64 100 1002", fis.Id),
            Contact.Create("Aleksandar",  "Jovanović",  "aleksandar.jovanovic@fis.rs",   "+381 64 100 1003", fis.Id),

            // Levi9 — 4 contacts
            Contact.Create("Marko",       "Nikolić",    "marko.nikolic@levi9.com",       "+381 65 200 2001", levi9.Id),
            Contact.Create("Milica",      "Đorđević",   "milica.djordjevic@levi9.com",   "+381 65 200 2002", levi9.Id),
            Contact.Create("Stefan",      "Ilić",       "stefan.ilic@levi9.com",         "+381 65 200 2003", levi9.Id),
            Contact.Create("Jovana",      "Stanković",  "jovana.stankovic@levi9.com",    "+381 65 200 2004", levi9.Id),

            // Mercator — 2 contacts
            Contact.Create("Petar",       "Stojanović", "petar.stojanovic@mercator.rs",  "+381 63 300 3001", mercator.Id),
            Contact.Create("Ana",         "Vasiljević", "ana.vasiljevic@mercator.rs",    "+381 63 300 3002", mercator.Id),

            // Connect Software Solutions — 3 contacts
            Contact.Create("Vladimir",    "Popović",    "vladimir.popovic@connect.rs",   "+381 66 400 4001", connect.Id),
            Contact.Create("Tijana",      "Simić",      "tijana.simic@connect.rs",       "+381 66 400 4002", connect.Id),
            Contact.Create("Nemanja",     "Kovačević",  "nemanja.kovacevic@connect.rs",  "+381 66 400 4003", connect.Id),

            // MK Group — 2 contacts
            Contact.Create("Luka",        "Lazić",      "luka.lazic@mkgroup.rs",         "+381 64 500 5001", mkGroup.Id),
            Contact.Create("Marina",      "Bogdanović", "marina.bogdanovic@mkgroup.rs",  "+381 64 500 5002", mkGroup.Id),

            // GTS Adriatic — 4 contacts
            Contact.Create("Ivan",        "Ristić",     "ivan.ristic@gtsadriatic.com",   "+381 69 600 6001", gts.Id),
            Contact.Create("Katarina",    "Đokić",      "katarina.djokic@gtsadriatic.com", "+381 69 600 6002", gts.Id),
            Contact.Create("Miloš",       "Savić",      "milos.savic@gtsadriatic.com",   "+381 69 600 6003", gts.Id),
            Contact.Create("Sofija",      "Lukić",      "sofija.lukic@gtsadriatic.com",  "+381 69 600 6004", gts.Id),
        ];
    }
}
