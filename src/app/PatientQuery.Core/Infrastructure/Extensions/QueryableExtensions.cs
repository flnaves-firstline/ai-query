using PatientQuery.Common.Constants;
using PatientQuery.Core.Infrastructure.Services;

namespace PatientQuery.Core.Infrastructure.Extensions;

public static class QueryableExtensions
{
    public static FilterService<TModel> Filter<TModel>(this IQueryable<TModel> query) =>
        new(query);

    public static OrderService<T> Order<T>(this IQueryable<T> query, string orderBy, string sortBy) =>
        new(query, orderBy, sortBy);

    public static IQueryable<T> Page<T>(this IQueryable<T> query, int page, int pageSize = CommonConstants.PageSize) =>
        query.Skip(page * pageSize).Take(pageSize);
}
