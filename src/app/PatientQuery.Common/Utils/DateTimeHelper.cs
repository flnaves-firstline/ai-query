namespace PatientQuery.Common.Utils;

public class DateTimeHelper
{
    public static DateTime Now => DateTime.UtcNow;

    public static (DateTime From, DateTime To) AgeToDob(int age)
    {
        var now = DateTime.UtcNow;
        var to = now.AddYears(-age);
        var from = to.AddYears(-1).AddDays(1);
        return (from, to);
    }
}
