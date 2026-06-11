using FinPlan.Api.GraphQL.Errors;
using FluentResults;

namespace FinPlan.Api.GraphQL;

/// <summary>
/// Bridges <c>FluentResults</c> outcomes into the GraphQL execution model: success values flow
/// through, failures throw <see cref="RequestException"/> (joining all reasons into one message).
/// </summary>
/// <remarks>
/// Fully qualifies <c>FluentResults.Result</c> because HotChocolate's global usings also pull in
/// <c>GreenDonut.Result&lt;T&gt;</c>, which would otherwise be ambiguous here.
/// </remarks>
internal static class ResultExtensions
{
    public static T Unwrap<T>(this FluentResults.Result<T> result) =>
        result.IsSuccess ? result.Value : throw Fail(result);

    // For void commands: throws on failure, otherwise signals success to the mutation payload.
    public static bool Unwrap(this FluentResults.Result result) =>
        result.IsSuccess ? true : throw Fail(result);

    // For nullable single-item queries: a failure (e.g. not found) maps to null rather than an error.
    public static T? UnwrapOrNull<T>(this FluentResults.Result<T> result) where T : class =>
        result.IsSuccess ? result.Value : null;

    private static RequestException Fail(IResultBase result) =>
        new(string.Join("; ", result.Errors.Select(error => error.Message)));
}
