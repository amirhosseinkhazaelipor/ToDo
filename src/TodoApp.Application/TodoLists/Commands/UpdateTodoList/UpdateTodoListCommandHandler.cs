using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;
using TodoApp.Domain.ValueObjects;

namespace TodoApp.Application.TodoLists.Commands.UpdateTodoList;

public sealed class UpdateTodoListCommandHandler(ITodoListRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateTodoListCommand>
{
    public async Task Handle(UpdateTodoListCommand request, CancellationToken cancellationToken)
    {
        var todoList = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoList), request.Id);

        todoList.UpdateDetails(request.Title, Colour.From(request.Colour));

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
