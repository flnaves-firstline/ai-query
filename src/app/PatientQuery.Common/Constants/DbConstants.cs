namespace PatientQuery.Common.Constants;

public class DbConstants
{
    public static string TablePrefix { get; } = "pq_";
    public static string SchemaName { get; } = "public";
    public static string ResourceTable { get; } = GetDefaultName(nameof(ResourceTable));
    public static string AiCachedRequestTable { get; } = GetDefaultName(nameof(AiCachedRequestTable));
    private static string GetDefaultName(string name) =>
        TablePrefix + name.Replace("Table", "");
}
