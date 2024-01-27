namespace PatientQuery.Db.DbModels;

public class AiCachedRequestDbModel : IEntityTypeConfiguration<AiCachedRequestDbModel>
{
    public int Id { get; set; }

    public string Request { get; set; } = null!;

    public string Response { get; set; } = null!;

    public DateTime Created { get; set; }

    public void Configure(EntityTypeBuilder<AiCachedRequestDbModel> builder)
    {
        builder.ToTable(DbConstants.AiCachedRequestTable, DbConstants.SchemaName).HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Request).IsRequired();
        builder.Property(x => x.Response).IsRequired();
    }
}
