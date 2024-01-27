using System.Data;

using Npgsql;

public class OmopDapperContext
{
    private readonly string _connectionString;

    public OmopDapperContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    public IDbConnection CreateConnection() => new NpgsqlConnection(_connectionString);
}
