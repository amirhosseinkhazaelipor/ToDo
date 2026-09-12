using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Common;

namespace TodoApp.Infrastructure.Persistence.Interceptors;

/// <summary>
/// Populates audit timestamps on every insert/update (cross-cutting concern
/// handled centrally, so entities and handlers stay clean).
/// </summary>
public sealed class AuditableEntityInterceptor(IDateTime dateTime) : SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        UpdateAuditableEntities(eventData.Context);

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private void UpdateAuditableEntities(DbContext? dbContext)
    {
        if (dbContext is null)
        {
            return;
        }

        var utcNow = dateTime.NowUtc;

        foreach (var entry in dbContext.ChangeTracker.Entries<BaseAuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAtUtc = utcNow;
                    entry.Entity.LastModifiedAtUtc = utcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.LastModifiedAtUtc = utcNow;
                    break;
            }
        }
    }
}
