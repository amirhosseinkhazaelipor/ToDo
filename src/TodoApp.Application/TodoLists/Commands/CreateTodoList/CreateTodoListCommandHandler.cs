using MediatR;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.Application.TodoLists.Commands.CreateTodoList;

public sealed class CreateTodoListCommandHandler(ITodoListRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<CreateTodoListCommand, Guid>
{
    public async Task<Guid> Handle(CreateTodoListCommand request, CancellationToken cancellationToken)
    {
        var todoList = new TodoList(request.Title, Colour.From(request.Colour));

        await repository.AddAsync(todoList, cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return todoList.Id;
    }
}
