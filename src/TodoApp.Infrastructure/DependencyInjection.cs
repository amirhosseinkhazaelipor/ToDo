using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TodoApp.Application.Common.Interfaces;
using TodoApp.Infrastructure.Auth;
using TodoApp.Infrastructure.Common.Behaviors;
using TodoApp.Infrastructure.Persistence;
using TodoApp.Infrastructure.Persistence.Interceptors;
using TodoApp.Infrastructure.Persistence.Repositories;
using TodoApp.Infrastructure.Services;

namespace TodoApp.Infrastructure;

/// <summary>
/// Composition root of the Infrastructure layer: database provider,
/// interceptors, repositories and implementation services.
/// </summary>
public static class DependencyInjection
{
    public const string DefaultConnectionName = "Default";

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
        services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

        services.AddDbContext<ApplicationDbContext>((serviceProvider, options) =>
        {
            options
                .UseSqlServer(configuration.GetConnectionString(DefaultConnectionName))
                .AddInterceptors(serviceProvider.GetServices<ISaveChangesInterceptor>());
        });

        services.AddScoped<IUnitOfWork>(serviceProvider => serviceProvider.GetRequiredService<ApplicationDbContext>());

        services.AddScoped<ITodoListRepository, TodoListRepository>();
        services.AddScoped<ITodoItemRepository, TodoItemRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        // Registered after the Application behaviours => innermost in the
        // pipeline: validation failures never open a transaction.
        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TransactionBehavior<,>));

        services.AddScoped<IDateTime, DateTimeService>();
        services.AddScoped<IEmailSender, EmailSender>();

        services.Configure<PasswordHasherOptions>(configuration.GetSection(PasswordHasherOptions.SectionName));
        services.AddScoped<IPasswordHasher, Pbkdf2PasswordHasher>();

        services.Configure<JwtOptions>(configuration.GetSection(JwtOptions.SectionName));
        services.AddScoped<ITokenProvider, JwtTokenProvider>();

        return services;
    }
}
