using FluentResults;

namespace FinPlan.Application.Common.Messaging;

/// <summary>
/// A command that mutates state and produces a <typeparamref name="TResponse"/>
/// (always a FluentResults <see cref="Result"/> or <see cref="Result{T}"/>).
/// </summary>
public interface ICommand<TResponse> where TResponse : IResultBase;

/// <summary>A command that mutates state without returning a value.</summary>
public interface ICommand : ICommand<Result>;
