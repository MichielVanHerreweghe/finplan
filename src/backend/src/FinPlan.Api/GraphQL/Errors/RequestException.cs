namespace FinPlan.Api.GraphQL.Errors;

/// <summary>
/// Carries a failed <c>FluentResults</c> outcome across the resolver boundary. On mutations
/// it is caught by the mutation conventions (see the <c>[Error&lt;RequestException&gt;]</c>
/// attributes) and surfaced in the typed <c>errors</c> payload field; on queries it is turned
/// into a readable top-level error by <see cref="RequestExceptionFilter"/>.
/// </summary>
public sealed class RequestException(string message) : Exception(message);
