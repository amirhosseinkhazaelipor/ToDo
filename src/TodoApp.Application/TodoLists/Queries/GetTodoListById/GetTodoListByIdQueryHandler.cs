using MediatR;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Application.Common.Mappings;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoLists.Queries.GetTodoListById;

public sealed class GetTodoListByIdQueryHandler(ITodoListRepository repository)
    : IRequestHandler<GetTodoListByIdQuery, TodoListDto>
{
    public async Task<TodoListDto> Handle(GetTodoListByIdQuery request, CancellationToken cancellationToken)
    {
        var todoList = await repository.GetByIdWithItemsAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoList), request.Id);

        return todoList.ToDto();
    }
}
