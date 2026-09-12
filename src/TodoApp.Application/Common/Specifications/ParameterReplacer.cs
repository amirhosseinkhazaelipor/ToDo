using System.Linq.Expressions;

namespace TodoApp.Application.Common.Specifications;

/// <summary>
/// Rewrites a lambda body so that it uses a single shared parameter. This
/// keeps combined specifications fully translatable by EF Core.
/// </summary>
internal sealed class ParameterReplacer(ParameterExpression oldParameter, ParameterExpression newParameter)
    : ExpressionVisitor
{
    public static Expression Replace(Expression body, ParameterExpression oldParameter, ParameterExpression newParameter) =>
        new ParameterReplacer(oldParameter, newParameter).Visit(body)!;

    protected override Expression VisitParameter(ParameterExpression node) =>
        node == oldParameter ? newParameter : base.VisitParameter(node);
}
