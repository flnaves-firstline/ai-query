namespace PatientQuery.Common.Models;

public class FileModel
{
    public string Name { get; set; }
    public string ContentType { get; set; }
    public byte[] Data { get; set; }
}
