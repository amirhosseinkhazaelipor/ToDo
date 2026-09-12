using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Commands.DeleteTodoItem;

public sealed class DeleteTodoItemCommandHandler(
    ITodoItemRepository itemRepository,
    ITodoListRepository listRepository,
    IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteTodoItemCommand>
{
    public async Task Handle(DeleteTodoItemCommand request, CancellationToken cancellationToken)
    {
        var todoItem = await itemRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoItem), request.Id);

        var todoList = await listRepository.GetByIdWithItemsAsync(todoItem.ListId, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoList), todoItem.ListId);

        todoList.RemoveItem(todoItem.Id);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
