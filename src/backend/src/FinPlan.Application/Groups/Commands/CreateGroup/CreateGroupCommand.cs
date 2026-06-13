using FinPlan.Application.Common.Messaging;
using FluentResults;

namespace FinPlan.Application.Groups.Commands.CreateGroup;

// Returns the new group's OwnerId so the caller can immediately switch its active context to it.
public sealed record CreateGroupCommand(string Name, string? Description) : ICommand<Result<int>>;
