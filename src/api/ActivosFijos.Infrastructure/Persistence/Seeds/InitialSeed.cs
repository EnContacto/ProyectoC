using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Infrastructure.Persistence.Seeds;

public static class InitialSeed
{
    public static async Task ApplyAsync(ActivosFijosDbContext db)
    {
        await SeedCompaniesAsync(db);
        await SeedCategoriesAsync(db);
        await SeedAccountingAccountsAsync(db);
        await SeedAdminUserAsync(db);
    }

    private static async Task SeedCompaniesAsync(ActivosFijosDbContext db)
    {
        if (await db.Companies.AnyAsync()) return;

        db.Companies.AddRange(
            new Company { Name = "NOVACARGO", ShortName = "NOV" },
            new Company { Name = "IMPEX", ShortName = "IMP" },
            new Company { Name = "SERVIPALLET", ShortName = "SER" }
        );
        await db.SaveChangesAsync();
    }

    private static async Task SeedCategoriesAsync(ActivosFijosDbContext db)
    {
        if (await db.Categories.AnyAsync()) return;

        db.Categories.AddRange(
            new Category { Name = "Instalaciones",       ShortCode = "INST", DefaultUsefulLifeYears = 10, DefaultResidualRate = 0.10m, DisplayOrder = 1 },
            new Category { Name = "Muebles y Enseres",   ShortCode = "MUEN", DefaultUsefulLifeYears = 10, DefaultResidualRate = 0.05m, DisplayOrder = 2 },
            new Category { Name = "Maquinaria y Equipo", ShortCode = "MAEQ", DefaultUsefulLifeYears = 10, DefaultResidualRate = 0.10m, DisplayOrder = 3 },
            new Category { Name = "Equipo de Cómputo",   ShortCode = "EQCO", DefaultUsefulLifeYears = 3,  DefaultResidualRate = 0.10m, DisplayOrder = 4 },
            new Category { Name = "Vehículos",           ShortCode = "VEHI", DefaultUsefulLifeYears = 5,  DefaultResidualRate = 0.20m, DisplayOrder = 5 },
            new Category { Name = "Adecuaciones",        ShortCode = "ADEC", DefaultUsefulLifeYears = 10, DefaultResidualRate = 0.10m, DisplayOrder = 6 }
        );
        await db.SaveChangesAsync();
    }

    private static async Task SeedAccountingAccountsAsync(ActivosFijosDbContext db)
    {
        if (await db.AccountingAccounts.AnyAsync()) return;

        db.AccountingAccounts.AddRange(
            new AccountingAccount { Code = "1.02.01.04.01", Name = "Instalaciones" },
            new AccountingAccount { Code = "1.02.01.05.01", Name = "Muebles y Enseres" },
            new AccountingAccount { Code = "1.02.01.06.01", Name = "Maquinaria y Equipo" },
            new AccountingAccount { Code = "1.02.01.08.01", Name = "Equipo de Cómputo" },
            new AccountingAccount { Code = "1.02.01.09.01", Name = "Vehículos" },
            new AccountingAccount { Code = "1.02.01.10.01", Name = "Adecuaciones" }
        );
        await db.SaveChangesAsync();
    }

private static async Task SeedAdminUserAsync(ActivosFijosDbContext db)
{
    if (await db.Users.AnyAsync()) return;

    db.Users.Add(new User
    {
        Username = "Cristina",
        Email = "cristina@proyecto.local",
        FullName = "Administrador",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Lito1526")
    });
    await db.SaveChangesAsync();
}
}