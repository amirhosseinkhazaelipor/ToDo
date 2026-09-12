using System.Linq.Expressions;

namespace TodoApp.Application.Common.Specifications;

/// <summary>
/// Combinators for specifications (Composite pattern). <see cref="And"/> is
/// nullable-aware so handlers can build filters incrementally.
/// </summary>
public static class SpecificationExtensions
{
    public static ISpecification<T> And<T>(this ISpecification<T>? left, ISpecification<T> right) =>
        left is null ? right : new AndSpecification<T>(left, right);

    public static ISpecification<T> Or<T>(this ISpecification<T> left, ISpecification<T> right) =>
        new OrSpecification<T>(left, right);
}

public sealed class AndSpecification<T>(ISpecification<T> left, ISpecification<T> right) : ISpecification<T>
{
    public Expression<Func<T, bool>> ToExpression()
    {
        var leftExpression = left.ToExpression();
        var rightExpression = right.ToExpression();

        var parameter = Expression.Parameter(typeof(T), "x");
        var leftBody = ParameterReplacer.Replace(leftExpression.Body, leftExpression.Parameters[0], parameter);
        var rightBody = ParameterReplacer.Replace(rightExpression.Body, rightExpression.Parameters[0], parameter);

        return Expression.Lambda<Func<T, bool>>(Expression.AndAlso(leftBody, rightBody), parameter);
    }
}

public sealed class OrSpecification<T>(ISpecification<T> left, ISpecification<T> right) : ISpecification<T>
{
    public Expression<Func<T, bool>> ToExpression()
    {
        var leftExpression = left.ToExpression();
        var rightExpression = right.ToExpression();

        var parameter = Expression.Parameter(typeof(T), "x");
        var leftBody = ParameterReplacer.Replace(leftExpression.Body, leftExpression.Parameters[0], parameter);
        var rightBody = ParameterReplacer.Replace(rightExpression.Body, rightExpression.Parameters[0], parameter);

        return Expression.Lambda<Func<T, bool>>(Expression.OrElse(leftBody, rightBody), parameter);
    }
}
