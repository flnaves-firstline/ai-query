namespace PatientQuery.Core.Models.Config
{
    public class AuthConfigModel
    {
        public string Key { get; set; }
        public string Audience { get; set; }
        public string Issuer { get; set; }
        public string PasswordSalt { get; set; }
        public int Expires { get; set; }
    }
}
