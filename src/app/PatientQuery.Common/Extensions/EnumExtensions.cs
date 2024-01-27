using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace PatientQuery.Common.Extensions;

public static class EnumExtensions
{
    public static string GetName(this Enum enumType)
    {
        return enumType
            .GetType()
            .GetMember(enumType.ToString())
            .First()
            .GetCustomAttribute<DisplayAttribute>()
            ?.Name
            ?? enumType.ToString();
    }
}
