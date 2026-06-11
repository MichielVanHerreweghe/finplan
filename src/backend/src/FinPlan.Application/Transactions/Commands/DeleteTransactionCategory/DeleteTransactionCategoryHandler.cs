using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.DeleteTransactionCategory;

internal sealed class DeleteTransactionCategoryHandler(
    ITransactionCategoryRepository categories,
    IUnitOfWork unitOfWork) : ICommandHandler<DeleteTransactionCategoryCommand, Result>
{
    public async Task<Result> Handle(DeleteTransactionCategoryCommand command, CancellationToken ct)
    {
        TransactionCategory? category = await categories.GetByIdAsync(command.Id, ct);

        if (category is null)
            return Result.Fail($"Category {command.Id} does not exist.");

        categories.Remove(category);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
