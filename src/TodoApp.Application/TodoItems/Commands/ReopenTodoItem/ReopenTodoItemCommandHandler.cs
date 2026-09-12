using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Commands.ReopenTodoItem;

public sealed class ReopenTodoItemCommandHandler(ITodoItemRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<ReopenTodoItemCommand>
{
    public async Task Handle(ReopenTodoItemCommand request, CancellationToken cancellationToken)
    {
        var todoItem = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoItem), request.Id);

        todoItem.Reopen();

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
