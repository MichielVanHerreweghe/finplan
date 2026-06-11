using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.UpdateTransactionCategory;

internal sealed class UpdateTransactionCategoryHandler(
    ITransactionCategoryRepository categories,
    IUnitOfWork unitOfWork) : ICommandHandler<UpdateTransactionCategoryCommand, Result>
{
    public async Task<Result> Handle(UpdateTransactionCategoryCommand command, CancellationToken ct)
    {
        TransactionCategory? category = await categories.GetByIdAsync(command.Id, ct);

        if (category is null)
            return Result.Fail($"Category {command.Id} does not exist.");

        // Reject a rename that would collide with a different existing category.
        TransactionCategory? withName = await categories.GetByNameAsync(command.Name, ct);
        if (withName is not null && withName.Id != category.Id)
            return Result.Fail($"A category named '{command.Name}' already exists.");

        Result updated = category.Update(command.Name);

        if (updated.IsFailed)
            return updated;

        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok();
    }
}
