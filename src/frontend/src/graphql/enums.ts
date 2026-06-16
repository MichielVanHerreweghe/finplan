// String-union mirrors of the backend GraphQL enums (HotChocolate emits
// CONSTANT_CASE values; codegen with `enumsAsTypes` produces identical unions,
// so these stay assignable to the generated query-variable types).

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export type TransactionSort =
  | "DATE_DESC"
  | "DATE_ASC"
  | "AMOUNT_DESC"
  | "AMOUNT_ASC"
  | "NAME_ASC"
  | "NAME_DESC";

export type NameSort = "NAME_ASC" | "NAME_DESC";

export type PocketSort = "NAME_ASC" | "NAME_DESC" | "BALANCE_DESC" | "BALANCE_ASC";

export type SavingGoalStatus = "ALL" | "ACTIVE" | "COMPLETED" | "OVERDUE";

export type SavingGoalSort =
  | "NAME_ASC"
  | "DEADLINE_ASC"
  | "PROGRESS_DESC"
  | "TARGET_DESC"
  | "REMAINING_ASC";
