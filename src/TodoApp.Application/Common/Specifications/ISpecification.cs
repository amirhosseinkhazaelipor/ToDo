using System.Linq.Expressions;

namespace TodoApp.Application.Common.Specifications;

/// <summary>
/// Specification pattern: encapsulates a reusable query predicate. The
/// Infrastructure layer translates the returned expression into SQL.
/// </summary>
public interface ISpecification<T>
{
    Expression<Func<T, bool>> ToExpression();
}
