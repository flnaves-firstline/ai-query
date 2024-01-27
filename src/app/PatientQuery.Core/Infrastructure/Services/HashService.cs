using System.Security.Cryptography;

namespace PatientQuery.Core.Infrastructure.Services;

public interface IHashService
{
    string Hash(string password);
}

public class HashService : IHashService
{
    private readonly string _salt;

    public HashService(string salt)
    {
        _salt = salt;
    }

    public string Hash(string password)
    {
        var bytes = Encoding.UTF8.GetBytes(_salt + password + _salt);
        using var algorithm = SHA512.Create();
        var hashBytes = algorithm.ComputeHash(bytes);
        return Convert.ToBase64String(hashBytes);
    }
}
