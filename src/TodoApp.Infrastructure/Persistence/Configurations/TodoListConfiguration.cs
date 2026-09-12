using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoApp.Domain.Entities;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.Infrastructure.Persistence.Configurations;

/// <summary>
/// Persistence mapping for the <see cref="TodoList"/> aggregate root.
/// </summary>
public class TodoListConfiguration : IEntityTypeConfiguration<TodoList>
{
    public void Configure(EntityTypeBuilder<TodoList> builder)
    {
        builder.HasKey(list => list.Id);

        builder.Property(list => list.Title)
            .IsRequired()
            .HasMaxLength(TodoList.MaxTitleLength);

        // Value Object persisted through a value converter, with a comparer
        // so EF Core performs correct change tracking.
        builder.Property(list => list.Colour)
            .HasConversion(colour => colour.Code, code => Colour.From(code))
            .HasMaxLength(7)
            .IsRequired();

        builder.Property(list => list.Colour).Metadata.SetValueComparer(
            new Microsoft.EntityFrameworkCore.ChangeTracking.ValueComparer<Colour>(
                (left, right) => left!.Code == right!.Code,
                colour => colour.Code.GetHashCode(),
                colour => Colour.From(colour.Code)));

        builder.Navigation(list => list.Items)
            .UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(list => list.CreatedAtUtc);
    }
}
