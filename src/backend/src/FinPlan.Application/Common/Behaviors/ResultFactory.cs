using System.Linq.Expressions;
using System.Reflection;
using FluentResults;

namespace FinPlan.Application.Common.Behaviors;

/// <summary>
/// Builds a failed result for an arbitrary FluentResults response type. Used by the
/// validation decorator to short-circuit without knowing whether the handler returns
/// <see cref="Result"/> or <see cref="Result{T}"/>.
/// </summary>
/// <remarks>
/// The factory delegate is resolved once per closed <typeparamref name="TResponse"/> — a
/// static field on a generic type is per-constructed-type, so the reflection cost is paid
/// a single time per message response type, never per request.
/// </remarks>
internal static class ResultFactory<TResponse> where TResponse : IResultBase
{
    private static readonly Func<IEnumerable<IError>, TResponse> Failer = BuildFailer();

    public static TResponse Fail(IEnumerable<IError> errors) => Failer(errors);

    private static Func<IEnumerable<IError>, TResponse> BuildFailer()
    {
        Type responseType = typeof(TResponse);

        if (responseType == typeof(Result))
            return errors => (TResponse)(object)Result.Fail(errors);

        if (responseType.IsGenericType && responseType.GetGenericTypeDefinition() == typeof(Result<>))
        {
            Type valueType = responseType.GetGenericArguments()[0];

            MethodInfo failGeneric = typeof(Result)
                .GetMethods(BindingFlags.Public | BindingFlags.Static)
                .Single(m => m is { Name: nameof(Result.Fail), IsGenericMethodDefinition: true }
                             && m.GetParameters() is [{ ParameterType: var p }]
                             && p == typeof(IEnumerable<IError>))
                .MakeGenericMethod(valueType);

            ParameterExpression errorsParam = Expression.Parameter(typeof(IEnumerable<IError>), "errors");
            MethodCallExpression call = Expression.Call(failGeneric, errorsParam);

            return Expression.Lambda<Func<IEnumerable<IError>, TResponse>>(call, errorsParam).Compile();
        }

        throw new InvalidOperationException(
            $"The messaging pipeline only supports FluentResults Result or Result<T> responses, " +
            $"but '{responseType}' was used.");
    }
}
