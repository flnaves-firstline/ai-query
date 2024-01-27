using System.ComponentModel.DataAnnotations;

using PatientQuery.Common.Constants;

namespace PatientQuery.Core.Infrastructure.Models;

public record PageQuery<T> : IQuery<Page<T>>
{
    public int Page { get; init; }

    public int PageSize { get; init; } = CommonConstants.PageSize;

    public string SortBy { get; init; } = "asc";

    [Required]
    public string OrderBy { get; init; } = null!;
}
