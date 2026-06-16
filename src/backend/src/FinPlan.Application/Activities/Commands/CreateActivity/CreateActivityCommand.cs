using FinPlan.Application.Common.Messaging;
using FluentResults;

namespace FinPlan.Application.Activities.Commands.CreateActivity;

public sealed record CreateActivityCommand(string Name, string? Description) : ICommand<Result<int>>;
