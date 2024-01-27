namespace PatientQuery.Common.Extensions;

public static class EnumerableExtensions
{
    public static (List<T1> Deleted, List<(T1 DbItem, T2 Item)> Common, List<T2> Added) Diff<T1, T2, TKey>(
        this IEnumerable<T1> collection1, IEnumerable<T2> collection2,
        Func<T1, TKey> keySelector1, Func<T2, TKey> keySelector2)
    {
        var deleted = new List<T1>();
        var common = new List<(T1, T2)>();
        var added = collection2.ToList();
        foreach (var item1 in collection1)
        {
            var key = keySelector1(item1);
            var item2 = added.FirstOrDefault(x => keySelector2(x).Equals(key));
            if (item2 != null)
            {
                common.Add((item1, item2));
                added.Remove(item2);
            }
            else
                deleted.Add(item1);
        }
        return (deleted, common, added);
    }

    public static IEnumerable<T> Traverse<T>(this IEnumerable<T> source, Func<T, IEnumerable<T>> elementSelector)
    {
        var stack = new Stack<IEnumerator<T>>();
        var e = source.GetEnumerator();
        try
        {
            while (true)
            {
                while (e.MoveNext())
                {
                    var item = e.Current;
                    yield return item;
                    var elements = elementSelector(item);
                    if (elements == null)
                        continue;
                    stack.Push(e);
                    e = elements.GetEnumerator();
                }
                if (stack.Count == 0)
                    break;
                e.Dispose();
                e = stack.Pop();
            }
        }
        finally
        {
            e.Dispose();
            while (stack.Count != 0)
                stack.Pop().Dispose();
        }
    }
}
