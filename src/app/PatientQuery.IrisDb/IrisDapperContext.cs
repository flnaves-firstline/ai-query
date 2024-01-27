using System.Data;

using InterSystems.Data.IRISClient;

public class IrisDapperContext
{
    private readonly string _connectionString;

    public IrisDapperContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    public IDbConnection CreateConnection() => new IRISConnection(_connectionString);
}
