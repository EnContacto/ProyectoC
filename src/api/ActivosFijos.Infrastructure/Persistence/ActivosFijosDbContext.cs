using ActivosFijos.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ActivosFijos.Infrastructure.Persistence;

public class ActivosFijosDbContext : DbContext
{
    public ActivosFijosDbContext(DbContextOptions<ActivosFijosDbContext> options)
        : base(options) { }

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Custodian> Custodians => Set<Custodian>();
    public DbSet<AccountingAccount> AccountingAccounts => Set<AccountingAccount>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<AssetEvent> AssetEvents => Set<AssetEvent>();
    public DbSet<AssetStatusHistory> AssetStatusHistories => Set<AssetStatusHistory>();
    public DbSet<DepreciationConfig> DepreciationConfigs => Set<DepreciationConfig>();
    public DbSet<DepreciationSchedule> DepreciationSchedules => Set<DepreciationSchedule>();
    public DbSet<DepreciationSnapshot> DepreciationSnapshots => Set<DepreciationSnapshot>();
    public DbSet<ImportBatch> ImportBatches => Set<ImportBatch>();
    public DbSet<ImportError> ImportErrors => Set<ImportError>();
    public DbSet<ImportStaging> ImportStaging => Set<ImportStaging>();
    public DbSet<User> Users => Set<User>();
    public DbSet<ReportTemplate> ReportTemplates => Set<ReportTemplate>();
    public DbSet<ReportRun> ReportRuns => Set<ReportRun>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ActivosFijosDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}