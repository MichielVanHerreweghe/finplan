using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Pockets.Commands.UpdatePocket;

public sealed record UpdatePocketCommand(
    int Id,
    string Name,
    string? Description,
    int? ParentPocketId,
    decimal StartingAmount) : ICommand;
