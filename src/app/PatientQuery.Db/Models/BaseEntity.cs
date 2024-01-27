namespace PatientQuery.Db.Models;

public abstract class BaseEntity
{
    public DateTime Created { get; set; }
    public DateTime? Updated { get; set; }
}
