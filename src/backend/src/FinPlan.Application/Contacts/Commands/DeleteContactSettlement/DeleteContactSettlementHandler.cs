using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Contacts;
using FluentResults;

namespace FinPlan.Application.Contacts.Commands.DeleteContactSettlement;

internal sealed class DeleteContactSettlementHandler(
    IContactLedgerRepository ledger,
    ICurrentUserProvider currentUser,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteContactSettlementCommand, Result>
{
    public async Task<Result> Handle(DeleteContactSettlementCommand command, CancellationToken ct)
    {
        ContactSettlement? settlement = await ledger.GetSettlementByIdAsync(command.SettlementId, ct);

        if (settlement is null ||
            (settlement.UserAId != currentUser.CurrentUserId && settlement.UserBId != currentUser.CurrentUserId))
            return Result.Fail($"Settlement {command.SettlementId} does not exist.");

        ledger.RemoveSettlement(settlement);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
