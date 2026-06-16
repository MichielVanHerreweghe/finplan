using FinPlan.Application.Common.Messaging;

namespace FinPlan.Application.Contacts.Commands.DeleteContactExpense;

public sealed record DeleteContactExpenseCommand(int ExpenseId) : ICommand;
