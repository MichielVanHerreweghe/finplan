using FinPlan.Application.Common.Messaging;
using FluentResults;

namespace FinPlan.Application.Pockets.Commands.CreatePocket;

public sealed record CreatePocketCommand(
    string Name,
    string? Description,
    int? ParentPocketId,
    decimal StartingAmount) : ICommand<Result<int>>;
