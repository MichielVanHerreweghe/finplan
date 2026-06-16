using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Users.Commands.CompleteProfile;

public sealed record CompleteProfileCommand(string FirstName, string LastName) : ICommand;
