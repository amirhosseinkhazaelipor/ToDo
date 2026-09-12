using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoApp.Domain.Entities;

namespace TodoApp.Infrastructure.Persistence.Configurations;

/// <summary>
/// Persistence mapping for <see cref="TodoItem"/>: FK to its aggregate root,
/// cascade delete and indexes for the query paths used by the API.
/// </summary>
public class TodoItemConfiguration : IEntityTypeConfiguration<TodoItem>
{
    public void Configure(EntityTypeBuilder<TodoItem> builder)
    {
        builder.HasKey(item => item.Id);

        builder.Property(item => item.Title)
            .IsRequired()
            .HasMaxLength(TodoItem.MaxTitleLength);

        builder.Property(item => item.Note)
            .HasMaxLength(TodoItem.MaxNoteLength);

        builder.HasOne<TodoList>()
            .WithMany(list => list.Items)
            .HasForeignKey(item => item.ListId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(item => item.ListId);
        builder.HasIndex(item => item.DueDateUtc);
        builder.HasIndex(item => new { item.ListId, item.Done });
    }
}
