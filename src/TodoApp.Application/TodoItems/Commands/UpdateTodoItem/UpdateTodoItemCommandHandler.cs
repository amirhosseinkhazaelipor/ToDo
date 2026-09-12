using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Commands.UpdateTodoItem;

public sealed class UpdateTodoItemCommandHandler(ITodoItemRepository repository, IUnitOfWork unitOfWork)
    : IRequestHandler<UpdateTodoItemCommand>
{
    public async Task Handle(UpdateTodoItemCommand request, CancellationToken cancellationToken)
    {
        var todoItem = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoItem), request.Id);

        todoItem.UpdateDetails(request.Title, request.Note, request.Priority, request.DueDateUtc);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
