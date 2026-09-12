using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Application.Features.Auth.Commands.Login;
using TodoApp.Application.Features.Auth.Commands.Register;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public sealed class AuthController(ISender sender) : ControllerBase
{
    /// <summary>Registers a new user and returns an access token.</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterCommand command, CancellationToken cancellationToken)
    {
        var session = await sender.Send(command, cancellationToken);

        return Ok(session);
    }

    /// <summary>Authenticates a user and returns an access token.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginCommand command, CancellationToken cancellationToken)
    {
        var session = await sender.Send(command, cancellationToken);

        return Ok(session);
    }
}
