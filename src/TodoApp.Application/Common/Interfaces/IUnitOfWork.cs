namespace TodoApp.Application.Common.Interfaces;

/// <summary>
/// Unit of Work: one atomic save-point for all changes made by a use case.
/// Implemented by the EF Core <c>ApplicationDbContext</c>.
/// </summary>
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
