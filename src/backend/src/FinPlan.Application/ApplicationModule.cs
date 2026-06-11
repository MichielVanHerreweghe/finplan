using System.Reflection;
using FinPlan.Application.Common.Behaviors;
using FinPlan.Application.Common.Messaging;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace FinPlan.Application;

public static class ApplicationModule
{
    private static readonly Assembly ApplicationAssembly = typeof(ApplicationModule).Assembly;

    public static IServiceCollection RegisterApplication(this IServiceCollection services)
    {
        services.AddScoped<ISender, Sender>();

        services.RegisterHandlers();
        services.RegisterValidators();
        services.RegisterPipeline();

        return services;
    }

    // Registers every concrete command/query handler in the assembly against its closed
    // handler interface. Open generic decorators also implement these interfaces, so they
    // are filtered out here (non-generic-definition) and applied separately in RegisterPipeline.
    // Commands and queries are scanned in separate calls: chaining two AddClasses blocks in one
    // Scan silently drops the second block's registrations.
    private static void RegisterHandlers(this IServiceCollection services)
    {
        // publicOnly: false — handlers are internal sealed classes; the default scan skips them.
        services.Scan(scan => scan
            .FromAssemblies(ApplicationAssembly)
            .AddClasses(classes => classes
                .AssignableTo(typeof(ICommandHandler<,>))
                .Where(type => !type.IsGenericTypeDefinition), publicOnly: false)
            .AsImplementedInterfaces(type => IsClosed(type, typeof(ICommandHandler<,>)))
            .WithScopedLifetime());

        services.Scan(scan => scan
            .FromAssemblies(ApplicationAssembly)
            .AddClasses(classes => classes
                .AssignableTo(typeof(IQueryHandler<,>))
                .Where(type => !type.IsGenericTypeDefinition), publicOnly: false)
            .AsImplementedInterfaces(type => IsClosed(type, typeof(IQueryHandler<,>)))
            .WithScopedLifetime());
    }

    private static void RegisterValidators(this IServiceCollection services) =>
        services.Scan(scan => scan
            .FromAssemblies(ApplicationAssembly)
            .AddClasses(classes => classes.AssignableTo(typeof(IValidator<>)))
            .AsImplementedInterfaces(type => IsClosed(type, typeof(IValidator<>)))
            .WithTransientLifetime());

    // Wraps handlers inner-to-outer: validation first, then logging on the outside, so the
    // log entry captures the whole pipeline including any validation short-circuit.
    private static void RegisterPipeline(this IServiceCollection services)
    {
        services.TryDecorate(typeof(ICommandHandler<,>), typeof(ValidationCommandDecorator<,>));
        services.TryDecorate(typeof(ICommandHandler<,>), typeof(LoggingCommandDecorator<,>));

        services.TryDecorate(typeof(IQueryHandler<,>), typeof(ValidationQueryDecorator<,>));
        services.TryDecorate(typeof(IQueryHandler<,>), typeof(LoggingQueryDecorator<,>));
    }

    private static bool IsClosed(Type service, Type openGeneric) =>
        service.IsGenericType && service.GetGenericTypeDefinition() == openGeneric;
}
