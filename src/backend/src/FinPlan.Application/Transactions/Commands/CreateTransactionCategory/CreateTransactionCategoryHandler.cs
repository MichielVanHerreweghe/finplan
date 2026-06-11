using FinPlan.Application.Common.Messaging;
using FinPlan.Domain.Common;
using FinPlan.Domain.Transactions;
using FluentResults;

namespace FinPlan.Application.Transactions.Commands.CreateTransactionCategory;

internal sealed class CreateTransactionCategoryHandler(
    ITransactionCategoryRepository categories,
    IUnitOfWork unitOfWork) : ICommandHandler<CreateTransactionCategoryCommand, Result<int>>
{
    public async Task<Result<int>> Handle(CreateTransactionCategoryCommand command, CancellationToken ct)
    {
        if (await categories.ExistsWithNameAsync(command.Name, ct))
            return Result.Fail($"A category named '{command.Name}' already exists.");

        Result<TransactionCategory> created = TransactionCategory.Create(command.Name);

        if (created.IsFailed)
            return created.ToResult<int>();

        TransactionCategory category = created.Value;

        await categories.AddAsync(category, ct);
        await unitOfWork.SaveChangesAsync(ct);

        return Result.Ok(category.Id);
    }
}
