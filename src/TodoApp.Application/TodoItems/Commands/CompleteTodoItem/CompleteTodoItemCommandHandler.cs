using MediatR;
using TodoApp.Application.Common.Exceptions;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Domain.Entities;

namespace TodoApp.Application.TodoItems.Commands.CompleteTodoItem;

public sealed class CompleteTodoItemCommandHandler(ITodoItemRepository repository, IUnitOfWork unitOfWork, IDateTime dateTime)
    : IRequestHandler<CompleteTodoItemCommand>
{
    public async Task Handle(CompleteTodoItemCommand request, CancellationToken cancellationToken)
    {
        var todoItem = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(TodoItem), request.Id);

        todoItem.Complete(dateTime.NowUtc);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
