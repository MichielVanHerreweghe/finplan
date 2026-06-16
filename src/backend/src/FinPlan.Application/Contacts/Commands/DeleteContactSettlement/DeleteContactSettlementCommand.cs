using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Contacts.Commands.DeleteContactSettlement;

public sealed record DeleteContactSettlementCommand(int SettlementId) : ICommand;
