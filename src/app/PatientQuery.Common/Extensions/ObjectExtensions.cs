namespace PatientQuery.Common.Extensions;

public static class ObjectExtensions
{
    public static T ToEnum<T>(this object obj)
    {
        var str = obj.ToString();

        if (Enum.IsDefined(typeof(T), str))
            return (T)Enum.Parse(typeof(T), str);

        int num;
        if (int.TryParse(str, out num))
        {
            if (Enum.IsDefined(typeof(T), num))
                return (T)Enum.ToObject(typeof(T), num);
        }

        throw new ArgumentException();
    }
}
