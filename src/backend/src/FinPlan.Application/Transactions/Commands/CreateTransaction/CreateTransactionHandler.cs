using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Pockets;
using FinPlan.Domain.SavingGoals;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.CreateTransaction;

internal sealed class CreateTransactionHandler(
    ITransactionRepository transactions,
    ITransactionCategoryRepository categories,
    IPocketRepository pockets,
    ISavingGoalRepository savingGoals,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateTransactionCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateTransactionCommand command, CancellationToken ct)
    {
        if (command.CategoryId is { } categoryId
            && await categories.GetByIdAsync(categoryId, ct) is null)
        {
            return Result.Fail($"Category {categoryId} does not exist.");
        }

        if (command.SavingGoalId is { } savingGoalId
            && await savingGoals.GetByIdAsync(savingGoalId, ct) is null)
        {
            return Result.Fail($"Saving goal {savingGoalId} does not exist.");
        }

        Result pocketsExist = await TransactionPockets.EnsureExist(
            pockets, command.FromPocketId, command.ToPocketId, ct);

        if (pocketsExist.IsFailed)
            return pocketsExist.ToResult<int>();

        Result<Transaction> created = Transaction.Create(
            command.Name, command.Date, command.Amount, command.Type, command.CategoryId,
            command.FromPocketId, command.ToPocketId, command.SavingGoalId);

        if (created.IsFailed)
            return created.ToResult<int>();

        Transaction transaction = created.Value;

        await transactions.AddAsync(transaction, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(transaction.Id);
    }
}
