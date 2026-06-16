using FinPlan.Application.Common.Messaging;
using FluentResults;

namespace FinPlan.Application.Contacts.Commands.RecordContactSettlement;

// Records a payment that settles part of a one-on-one balance. Returns the new settlement's id.
// ContactId is the current user's contact row; FromUserId/ToUserId are the two people in the pair.
public sealed record RecordContactSettlementCommand(
    int ContactId, decimal Amount, DateOnly Date, int FromUserId, int ToUserId) : ICommand<Result<int>>;
