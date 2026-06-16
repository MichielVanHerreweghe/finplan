using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Contacts.Commands.RemoveContact;

public sealed record RemoveContactCommand(int ContactId) : ICommand;
