using PatientQuery.Db.DbModels;

namespace PatientQuery.Db;

public class DatabaseContext : DbContext
{
    public DbSet<AiCachedRequestDbModel> AiCachedRequestDbModel => Set<AiCachedRequestDbModel>();

    public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(DbConstants.SchemaName);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(DatabaseContext).Assembly);
    }

    public override int SaveChanges()
    {
        PrepareEntities();
        return base.SaveChanges();
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        PrepareEntities();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void PrepareEntities()
    {
        var addedEntities = ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Added)
            .ToList();

        var modifiedEntities = ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.State == EntityState.Modified)
            .ToList();

        var currentTime = DateTime.UtcNow;

        foreach (var addedEntity in addedEntities)
            addedEntity.Property(x => x.Created).CurrentValue = currentTime;

        foreach (var modifiedEntity in modifiedEntities)
            modifiedEntity.Property(x => x.Updated).CurrentValue = currentTime;
    }
}
