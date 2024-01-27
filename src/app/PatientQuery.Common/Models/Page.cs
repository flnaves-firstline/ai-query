using PatientQuery.Common.Constants;

namespace PatientQuery.Common.Models;

public record Page<T>
{
    public IReadOnlyList<T> Items { get; init; }

    public int TotalPages { get; init; }

    public int TotalItems { get; init; }

    public int CurrentPage { get; init; }

    public int PageSize { get; init; }

    public Page(List<T> items, int totalItems, int currentPage, int pageSize = CommonConstants.PageSize)
    {
        CurrentPage = currentPage;
        PageSize = pageSize;
        TotalItems = totalItems;
        Items = items;

        TotalPages = PageSize != 0 ? (int)Math.Ceiling(TotalItems / (double)(PageSize + 1)) : 0;
    }
}
