using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.Common.Dtos;
using TodoApp.Application.Common.Models;
using TodoApp.Application.TodoLists.Commands.CreateTodoList;
using TodoApp.Application.TodoLists.Commands.DeleteTodoList;
using TodoApp.Application.TodoLists.Commands.UpdateTodoList;
using TodoApp.Application.TodoLists.Queries.GetTodoListById;
using TodoApp.Application.TodoLists.Queries.GetTodoLists;

namespace TodoApp.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/todo-lists")]
[Produces("application/json")]
public sealed class TodoListsController(ISender sender) : ControllerBase
{
    /// <summary>Returns a paged collection of todo lists.</summary>
    [HttpGet]
    public async Task<ActionResult<PaginatedList<TodoListSummaryDto>>> GetTodoLists(
        [FromQuery] GetTodoListsQuery query, CancellationToken cancellationToken) =>
        Ok(await sender.Send(query, cancellationToken));

    /// <summary>Returns a single todo list including its items.</summary>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<TodoListDto>> GetTodoList(Guid id, CancellationToken cancellationToken) =>
        Ok(await sender.Send(new GetTodoListByIdQuery(id), cancellationToken));

    /// <summary>Creates a new todo list. Returns 201 with the new id.</summary>
    [HttpPost]
    public async Task<IActionResult> CreateTodoList(CreateTodoListCommand command, CancellationToken cancellationToken)
    {
        var id = await sender.Send(command, cancellationToken);

        return CreatedAtAction(nameof(GetTodoList), new { id }, new { id });
    }

    /// <summary>Renames a todo list or changes its colour.</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateTodoList(Guid id, UpdateTodoListRequest request, CancellationToken cancellationToken)
    {
        await sender.Send(new UpdateTodoListCommand(id, request.Title, request.Colour), cancellationToken);

        return NoContent();
    }

    /// <summary>Deletes a todo list together with its items.</summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteTodoList(Guid id, CancellationToken cancellationToken)
    {
        await sender.Send(new DeleteTodoListCommand(id), cancellationToken);

        return NoContent();
    }
}

/// <summary>API contract for updating a list; the id comes from the route.</summary>
public sealed record UpdateTodoListRequest(string Title, string Colour);
