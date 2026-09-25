using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ActivosFijos.Infrastructure.Persistence.Configurations;

public class AccountingAccountConfiguration : IEntityTypeConfiguration<AccountingAccount>
{
    public void Configure(EntityTypeBuilder<AccountingAccount> b)
    {
        b.ToTable("AccountingAccounts");
        b.HasKey(x => x.Id);
        b.Property(x => x.Code).HasMaxLength(50).IsRequired();
        b.Property(x => x.Name).HasMaxLength(200).IsRequired();
        b.HasIndex(x => x.Code).IsUnique();
    }
}