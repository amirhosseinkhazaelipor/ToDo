using MediatR;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Common.Mappings;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Queries.GetTodoItemById;

public sealed class GetTodoItemByIdQueryHandler(ITodoItemRepository repository)
    : IRequestHandler<GetTodoItemByIdQuery, TodoItemDto>
{
    public async Task<TodoItemDto> Handle(GetTodoItemByIdQuery request, CancellationToken cancellationToken)
    {
        var todoItem = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoItem), request.Id);

        return todoItem.ToDto();
    }
}
