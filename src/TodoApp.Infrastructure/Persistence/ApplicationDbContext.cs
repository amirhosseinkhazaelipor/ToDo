using Microsoft.EntityFrameworkCore;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Common;
using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Persistence;

/// <summary>
/// EF Core gateway to the database. Also serves as the concrete
/// <see cref="IUnitOfWork"/>: every SaveChangesAsync call is one atomic
/// unit of work.
/// </summary>
public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IUnitOfWork
{
    public DbSet<TodoList> TodoLists => Set<TodoList>();

    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Domain events are in-memory notifications, not persisted entities.
        modelBuilder.Ignore<BaseEvent>();

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
