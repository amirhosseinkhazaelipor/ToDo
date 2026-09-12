using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoLists.Commands.DeleteTodoList;

public sealed class DeleteTodoListCommandHandler(ITodoListRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<DeleteTodoListCommand>
{
    public async Task Handle(DeleteTodoListCommand request, CancellationToken cancellationToken)
    {
        var todoList = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoList), request.Id);

        repository.Remove(todoList);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
