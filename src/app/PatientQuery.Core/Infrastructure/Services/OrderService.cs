using System.Linq.Expressions;

namespace PatientQuery.Core.Infrastructure.Services;

public class OrderService<TEntity>
{
    private interface IOrderPreset
    {
        string Field { get; }
        IOrderedQueryable<TEntity> Apply(IQueryable<TEntity> query);
    }

    private class OrderPreset : IOrderPreset
    {
        public string Field { get; }

        private readonly Expression<Func<TEntity, object>> _expression;

        private readonly bool _ascSort;

        private readonly IOrderPreset _parent;

        public OrderPreset(string field, Expression<Func<TEntity, object>> expression, bool ascSort, IOrderPreset parent = null)
        {
            Field = field;
            _expression = expression;
            _ascSort = ascSort;
            _parent = parent;
        }

        public IOrderedQueryable<TEntity> Apply(IQueryable<TEntity> query)
        {
            if (_parent == null)
                return Apply(query, _expression);
            var orderedQuery = _parent.Apply(query);
            return ApplyThen(orderedQuery, _expression);
        }

        private IOrderedQueryable<TEntity> Apply(IQueryable<TEntity> query, Expression<Func<TEntity, object>> expression) =>
            _ascSort ? query.OrderBy(expression) : query.OrderByDescending(expression);

        private IOrderedQueryable<TEntity> ApplyThen(IOrderedQueryable<TEntity> query, Expression<Func<TEntity, object>> expression) =>
            _ascSort ? query.ThenBy(expression) : query.ThenByDescending(expression);
    }

    private readonly IQueryable<TEntity> _query;
    private readonly string _orderBy;
    private readonly bool _ascSort;

    private IOrderPreset _default;
    private readonly List<IOrderPreset> _presets = new();

    public OrderService(IQueryable<TEntity> query, string orderBy, string sortBy)
    {
        _query = query;
        _orderBy = orderBy;
        _ascSort = !string.Equals(sortBy, "desc", StringComparison.InvariantCultureIgnoreCase);
    }

    public OrderService<TEntity> Field(string field, params Expression<Func<TEntity, object>>[] expressions)
    {
        OrderPreset lastPreset = null;
        foreach (var expr in expressions)
            lastPreset = new OrderPreset(field, expr, _ascSort, lastPreset);
        _presets.Add(lastPreset);
        return this;
    }

    public OrderService<TEntity> Field(string field, params (Expression<Func<TEntity, object>>, bool?)[] expressions)
    {
        OrderPreset lastPreset = null;
        foreach (var (expr, ascSort) in expressions)
            lastPreset = new OrderPreset(field, expr, ascSort ?? _ascSort, lastPreset);
        _presets.Add(lastPreset);
        return this;
    }

    public OrderService<TEntity> Default(params Expression<Func<TEntity, object>>[] expressions)
    {
        OrderPreset lastPreset = null;
        foreach (var expr in expressions)
            lastPreset = new OrderPreset(null, expr, _ascSort, lastPreset);
        _default = lastPreset;
        return this;
    }

    public IOrderedQueryable<TEntity> Apply()
    {
        var preset = _presets.FirstOrDefault(x => x.Field == _orderBy) ?? _default;
        return preset != null ? preset.Apply(_query) : (IOrderedQueryable<TEntity>)_query;
    }
}
