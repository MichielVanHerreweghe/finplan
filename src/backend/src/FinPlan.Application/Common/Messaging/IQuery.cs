using FluentResults;

namespace FinPlan.Application.Common.Messaging;

/// <summary>
/// A read-only request that produces a <typeparamref name="TResponse"/>
/// (always a FluentResults <see cref="Result{T}"/>).
/// </summary>
public interface IQuery<TResponse> where TResponse : IResultBase;
