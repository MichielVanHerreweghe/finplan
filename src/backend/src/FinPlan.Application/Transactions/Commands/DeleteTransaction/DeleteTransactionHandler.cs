using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.DeleteTransaction;

internal sealed class DeleteTransactionHandler(
    ITransactionRepository transactions,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteTransactionCommand, Result>
{
    public async Task<Result> Handle(DeleteTransactionCommand command, CancellationToken ct)
    {
        Transaction? transaction = await transactions.GetByIdAsync(command.Id, ct);

        if (transaction is null)
            return Result.Fail($"Transaction {command.Id} does not exist.");

        transactions.Remove(transaction);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
