namespace PatientQuery.Core.Services
{
    public interface IContextService
    {
        int Id { get; }
    }

    public class ContextService : IContextService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public ContextService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int Id => int.Parse(_httpContextAccessor.HttpContext.User.Get(ClaimTypes.NameIdentifier));
    }
}
