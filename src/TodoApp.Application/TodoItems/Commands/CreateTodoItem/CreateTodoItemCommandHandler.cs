using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Commands.CreateTodoItem;

public sealed class CreateTodoItemCommandHandler(
    ITodoListRepository listRepository,
    ITodoItemRepository itemRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<CreateTodoItemCommand, Guid>
{
    public async Task<Guid> Handle(CreateTodoItemCommand request, CancellationToken cancellationToken)
    {
        // Items are created through the aggregate root so the invariant
        // "an item always belongs to an existing list" is enforced by the domain.
        var todoList = await listRepository.GetByIdWithItemsAsync(request.ListId, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoList), request.ListId);

        var todoItem = todoList.AddItem(request.Title, request.Priority, request.Note, request.DueDateUtc);

        // The domain assigns the GUID key, so the new item must be marked as
        // Added explicitly; otherwise EF Core would treat it as an existing entity.
        await itemRepository.AddAsync(todoItem, cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);

        return todoItem.Id;
    }
}
