using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.UpdateTransaction;

internal sealed class UpdateTransactionHandler(
    ITransactionRepository transactions,
    ITransactionCategoryRepository categories,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateTransactionCommand, Result>
{
    public async Task<Result> Handle(UpdateTransactionCommand command, CancellationToken ct)
    {
        Transaction? transaction = await transactions.GetByIdAsync(command.Id, ct);

        if (transaction is null)
            return Result.Fail($"Transaction {command.Id} does not exist.");

        if (command.CategoryId is { } categoryId
            && await categories.GetByIdAsync(categoryId, ct) is null)
        {
            return Result.Fail($"Category {categoryId} does not exist.");
        }

        Result updated = transaction.Update(
            command.Name, command.Date, command.Amount, command.Type, command.CategoryId);

        if (updated.IsFailed)
            return updated;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
