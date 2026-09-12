using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using NSubstitute;
using TodoApp.Application.Common.Behaviors;
using TodoApp.Application.Common.Interfaces;

namespace TodoApp.UnitTests.Application.Behaviors;

public sealed record TestRequest(string Name) : IRequest<string>;

public sealed class TestRequestValidator : AbstractValidator<TestRequest>
{
    public TestRequestValidator()
    {
        RuleFor(request => request.Name).NotEmpty();
    }
}

public class ValidationBehaviorTests
{
    [Fact]
    public async Task Handle_WithNoValidators_InvokesNextDirectly()
    {
        var behavior = new ValidationBehavior<TestRequest, string>([]);
        var request = new TestRequest(string.Empty);

        var result = await behavior.Handle(request, _ => Task.FromResult("ok"), CancellationToken.None);

        result.Should().Be("ok");
    }

    [Fact]
    public async Task Handle_WithValidRequest_CallsNext()
    {
        var validators = new IValidator<TestRequest>[] { new TestRequestValidator() };
        var behavior = new ValidationBehavior<TestRequest, string>(validators);

        var result = await behavior.Handle(new TestRequest("valid"), _ => Task.FromResult("ok"), CancellationToken.None);

        result.Should().Be("ok");
    }

    [Fact]
    public async Task Handle_WithInvalidRequest_ThrowsValidationExceptionWithoutCallingNext()
    {
        var validators = new IValidator<TestRequest>[] { new TestRequestValidator() };
        var behavior = new ValidationBehavior<TestRequest, string>(validators);
        var nextCalled = false;

        var act = () => behavior.Handle(
            new TestRequest(string.Empty),
            _ => { nextCalled = true; return Task.FromResult("ok"); },
            CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>();
        nextCalled.Should().BeFalse("invalid requests must never reach the handler");
    }

    [Fact]
    public void PerformanceBehaviour_IsRegisteredAsPipelineBehavior()
    {
        // Guard against accidental removal of the cross-cutting behaviours.
        typeof(PerformanceBehavior<TestRequest, string>)
            .Should().BeAssignableTo(typeof(IPipelineBehavior<TestRequest, string>));
        typeof(LoggingBehavior<TestRequest, string>)
            .Should().BeAssignableTo(typeof(IPipelineBehavior<TestRequest, string>));
    }

    [Fact]
    public async Task PerformanceBehavior_PassesThroughResponse()
    {
        var logger = Substitute.For<ILogger<PerformanceBehavior<TestRequest, string>>>();
        var behavior = new PerformanceBehavior<TestRequest, string>(logger);

        var result = await behavior.Handle(new TestRequest("x"), _ => Task.FromResult("ok"), CancellationToken.None);

        result.Should().Be("ok");
    }
}
