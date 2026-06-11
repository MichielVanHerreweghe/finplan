using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.CreateTransaction;

internal sealed class CreateTransactionHandler(
    ITransactionRepository transactions,
    ITransactionCategoryRepository categories,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateTransactionCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateTransactionCommand command, CancellationToken ct)
    {
        if (command.CategoryId is { } categoryId
            && await categories.GetByIdAsync(categoryId, ct) is null)
        {
            return Result.Fail($"Category {categoryId} does not exist.");
        }

        Result<Transaction> created = Transaction.Create(
            command.Name, command.Date, command.Amount, command.Type, command.CategoryId);

        if (created.IsFailed)
            return created.ToResult<int>();

        Transaction transaction = created.Value;

        await transactions.AddAsync(transaction, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(transaction.Id);
    }
}
