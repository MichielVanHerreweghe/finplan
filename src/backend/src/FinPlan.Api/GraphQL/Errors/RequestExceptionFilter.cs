using HotChocolate;
using HotChocolate.Execution;

namespace FinPlan.Api.GraphQL.Errors;

/// <summary>
/// Surfaces <see cref="RequestException"/> messages on top-level errors (i.e. from queries).
/// Mutation failures are intercepted by the mutation conventions before reaching here, so this
/// only affects query-side failures, where HotChocolate would otherwise mask the message.
/// </summary>
internal sealed class RequestExceptionFilter : IErrorFilter
{
    public IError OnError(IError error) =>
        error.Exception is RequestException requestException
            ? error.WithMessage(requestException.Message)
            : error;
}
