/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `Decimal` scalar type represents a decimal floating-point number with high precision. */
  Decimal: { input: number; output: number; }
  /** The `LocalDate` scalar type represents a date without time or time zone information. */
  LocalDate: { input: string; output: string; }
};

export type ActivityBalanceResponse = {
  __typename?: 'ActivityBalanceResponse';
  net: Scalars['Decimal']['output'];
  userId: Scalars['Int']['output'];
};

export type ActivityExpenseResponse = {
  __typename?: 'ActivityExpenseResponse';
  activityId: Scalars['Int']['output'];
  amount: Scalars['Decimal']['output'];
  date: Scalars['LocalDate']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  paidByUserId: Scalars['Int']['output'];
  splitType: SplitType;
  splits: Array<ActivityExpenseSplitResponse>;
};

export type ActivityExpenseSplitResponse = {
  __typename?: 'ActivityExpenseSplitResponse';
  amount: Scalars['Decimal']['output'];
  percentage?: Maybe<Scalars['Decimal']['output']>;
  userId: Scalars['Int']['output'];
};

export type ActivityMemberResponse = {
  __typename?: 'ActivityMemberResponse';
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  userId: Scalars['Int']['output'];
};

export type ActivityResponse = {
  __typename?: 'ActivityResponse';
  balances: Array<ActivityBalanceResponse>;
  createdByUserId: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  members: Array<ActivityMemberResponse>;
  name: Scalars['String']['output'];
  settlements: Array<ActivitySettlementResponse>;
};

export type ActivitySettlementResponse = {
  __typename?: 'ActivitySettlementResponse';
  amount: Scalars['Decimal']['output'];
  fromUserId: Scalars['Int']['output'];
  toUserId: Scalars['Int']['output'];
};

export type AddActivityMemberError = RequestError;

export type AddActivityMemberInput = {
  activityId: Scalars['Int']['input'];
  email: Scalars['String']['input'];
};

export type AddActivityMemberPayload = {
  __typename?: 'AddActivityMemberPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<AddActivityMemberError>>;
};

export type AddGroupMemberError = RequestError;

export type AddGroupMemberInput = {
  email: Scalars['String']['input'];
  groupId: Scalars['Int']['input'];
};

export type AddGroupMemberPayload = {
  __typename?: 'AddGroupMemberPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<AddGroupMemberError>>;
};

/** Defines when a policy shall be executed. */
export type ApplyPolicy =
  /** After the resolver was executed. */
  | 'AFTER_RESOLVER'
  /** Before the resolver was executed. */
  | 'BEFORE_RESOLVER'
  /** The policy is applied in the validation step before the execution. */
  | 'VALIDATION';

export type CreateActivityError = RequestError;

export type CreateActivityExpenseError = RequestError;

export type CreateActivityExpenseInput = {
  activityId: Scalars['Int']['input'];
  amount: Scalars['Decimal']['input'];
  date: Scalars['LocalDate']['input'];
  description: Scalars['String']['input'];
  paidByUserId: Scalars['Int']['input'];
  splitType: SplitType;
  splits: Array<SplitInput>;
};

export type CreateActivityExpensePayload = {
  __typename?: 'CreateActivityExpensePayload';
  errors?: Maybe<Array<CreateActivityExpenseError>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type CreateActivityInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateActivityPayload = {
  __typename?: 'CreateActivityPayload';
  errors?: Maybe<Array<CreateActivityError>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type CreateGroupError = RequestError;

export type CreateGroupInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateGroupPayload = {
  __typename?: 'CreateGroupPayload';
  errors?: Maybe<Array<CreateGroupError>>;
  ownerId?: Maybe<Scalars['Int']['output']>;
};

export type CreatePocketError = RequestError;

export type CreatePocketInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentPocketId?: InputMaybe<Scalars['Int']['input']>;
  startingAmount: Scalars['Decimal']['input'];
};

export type CreatePocketPayload = {
  __typename?: 'CreatePocketPayload';
  errors?: Maybe<Array<CreatePocketError>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type CreateSavingGoalError = RequestError;

export type CreateSavingGoalInput = {
  deadline?: InputMaybe<Scalars['LocalDate']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  pocketId: Scalars['Int']['input'];
  targetAmount: Scalars['Decimal']['input'];
};

export type CreateSavingGoalPayload = {
  __typename?: 'CreateSavingGoalPayload';
  errors?: Maybe<Array<CreateSavingGoalError>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type CreateTransactionCategoryError = RequestError;

export type CreateTransactionCategoryInput = {
  name: Scalars['String']['input'];
};

export type CreateTransactionCategoryPayload = {
  __typename?: 'CreateTransactionCategoryPayload';
  errors?: Maybe<Array<CreateTransactionCategoryError>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type CreateTransactionError = RequestError;

export type CreateTransactionInput = {
  amount: Scalars['Decimal']['input'];
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  date: Scalars['LocalDate']['input'];
  fromPocketId?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  savingGoalId?: InputMaybe<Scalars['Int']['input']>;
  toPocketId?: InputMaybe<Scalars['Int']['input']>;
  type: TransactionType;
};

export type CreateTransactionPayload = {
  __typename?: 'CreateTransactionPayload';
  errors?: Maybe<Array<CreateTransactionError>>;
  id?: Maybe<Scalars['Int']['output']>;
};

export type DeleteActivityError = RequestError;

export type DeleteActivityExpenseError = RequestError;

export type DeleteActivityExpenseInput = {
  id: Scalars['Int']['input'];
};

export type DeleteActivityExpensePayload = {
  __typename?: 'DeleteActivityExpensePayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeleteActivityExpenseError>>;
};

export type DeleteActivityInput = {
  id: Scalars['Int']['input'];
};

export type DeleteActivityPayload = {
  __typename?: 'DeleteActivityPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeleteActivityError>>;
};

export type DeleteGroupError = RequestError;

export type DeleteGroupInput = {
  groupId: Scalars['Int']['input'];
};

export type DeleteGroupPayload = {
  __typename?: 'DeleteGroupPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeleteGroupError>>;
};

export type DeletePocketError = RequestError;

export type DeletePocketInput = {
  id: Scalars['Int']['input'];
};

export type DeletePocketPayload = {
  __typename?: 'DeletePocketPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeletePocketError>>;
};

export type DeleteSavingGoalError = RequestError;

export type DeleteSavingGoalInput = {
  id: Scalars['Int']['input'];
};

export type DeleteSavingGoalPayload = {
  __typename?: 'DeleteSavingGoalPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeleteSavingGoalError>>;
};

export type DeleteTransactionCategoryError = RequestError;

export type DeleteTransactionCategoryInput = {
  id: Scalars['Int']['input'];
};

export type DeleteTransactionCategoryPayload = {
  __typename?: 'DeleteTransactionCategoryPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeleteTransactionCategoryError>>;
};

export type DeleteTransactionError = RequestError;

export type DeleteTransactionInput = {
  id: Scalars['Int']['input'];
};

export type DeleteTransactionPayload = {
  __typename?: 'DeleteTransactionPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<DeleteTransactionError>>;
};

export type Error = {
  message: Scalars['String']['output'];
};

export type GroupMemberResponse = {
  __typename?: 'GroupMemberResponse';
  displayName?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  userId: Scalars['Int']['output'];
};

export type GroupResponse = {
  __typename?: 'GroupResponse';
  createdByUserId: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  members: Array<GroupMemberResponse>;
  name: Scalars['String']['output'];
  ownerId: Scalars['Int']['output'];
};

export type LeaveGroupError = RequestError;

export type LeaveGroupInput = {
  groupId: Scalars['Int']['input'];
};

export type LeaveGroupPayload = {
  __typename?: 'LeaveGroupPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<LeaveGroupError>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addActivityMember: AddActivityMemberPayload;
  addGroupMember: AddGroupMemberPayload;
  createActivity: CreateActivityPayload;
  createActivityExpense: CreateActivityExpensePayload;
  createGroup: CreateGroupPayload;
  createPocket: CreatePocketPayload;
  createSavingGoal: CreateSavingGoalPayload;
  createTransaction: CreateTransactionPayload;
  createTransactionCategory: CreateTransactionCategoryPayload;
  deleteActivity: DeleteActivityPayload;
  deleteActivityExpense: DeleteActivityExpensePayload;
  deleteGroup: DeleteGroupPayload;
  deletePocket: DeletePocketPayload;
  deleteSavingGoal: DeleteSavingGoalPayload;
  deleteTransaction: DeleteTransactionPayload;
  deleteTransactionCategory: DeleteTransactionCategoryPayload;
  leaveGroup: LeaveGroupPayload;
  removeActivityMember: RemoveActivityMemberPayload;
  removeGroupMember: RemoveGroupMemberPayload;
  updatePocket: UpdatePocketPayload;
  updateSavingGoal: UpdateSavingGoalPayload;
  updateTransaction: UpdateTransactionPayload;
  updateTransactionCategory: UpdateTransactionCategoryPayload;
};


export type MutationAddActivityMemberArgs = {
  input: AddActivityMemberInput;
};


export type MutationAddGroupMemberArgs = {
  input: AddGroupMemberInput;
};


export type MutationCreateActivityArgs = {
  input: CreateActivityInput;
};


export type MutationCreateActivityExpenseArgs = {
  input: CreateActivityExpenseInput;
};


export type MutationCreateGroupArgs = {
  input: CreateGroupInput;
};


export type MutationCreatePocketArgs = {
  input: CreatePocketInput;
};


export type MutationCreateSavingGoalArgs = {
  input: CreateSavingGoalInput;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationCreateTransactionCategoryArgs = {
  input: CreateTransactionCategoryInput;
};


export type MutationDeleteActivityArgs = {
  input: DeleteActivityInput;
};


export type MutationDeleteActivityExpenseArgs = {
  input: DeleteActivityExpenseInput;
};


export type MutationDeleteGroupArgs = {
  input: DeleteGroupInput;
};


export type MutationDeletePocketArgs = {
  input: DeletePocketInput;
};


export type MutationDeleteSavingGoalArgs = {
  input: DeleteSavingGoalInput;
};


export type MutationDeleteTransactionArgs = {
  input: DeleteTransactionInput;
};


export type MutationDeleteTransactionCategoryArgs = {
  input: DeleteTransactionCategoryInput;
};


export type MutationLeaveGroupArgs = {
  input: LeaveGroupInput;
};


export type MutationRemoveActivityMemberArgs = {
  input: RemoveActivityMemberInput;
};


export type MutationRemoveGroupMemberArgs = {
  input: RemoveGroupMemberInput;
};


export type MutationUpdatePocketArgs = {
  input: UpdatePocketInput;
};


export type MutationUpdateSavingGoalArgs = {
  input: UpdateSavingGoalInput;
};


export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};


export type MutationUpdateTransactionCategoryArgs = {
  input: UpdateTransactionCategoryInput;
};

export type NameSort =
  | 'NAME_ASC'
  | 'NAME_DESC';

export type OwnerContextResponse = {
  __typename?: 'OwnerContextResponse';
  kind: OwnerKind;
  name: Scalars['String']['output'];
  ownerId: Scalars['Int']['output'];
};

export type OwnerKind =
  | 'GROUP'
  | 'PERSONAL'
  | 'UNDEFINED';

export type PocketResponse = {
  __typename?: 'PocketResponse';
  balance: Scalars['Decimal']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parentPocketId?: Maybe<Scalars['Int']['output']>;
  startingAmount: Scalars['Decimal']['output'];
};

export type PocketSort =
  | 'BALANCE_ASC'
  | 'BALANCE_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC';

export type Query = {
  __typename?: 'Query';
  activities: Array<ActivityResponse>;
  activity?: Maybe<ActivityResponse>;
  activityExpenses: Array<ActivityExpenseResponse>;
  groups: Array<GroupResponse>;
  myContexts: Array<OwnerContextResponse>;
  pocket?: Maybe<PocketResponse>;
  pockets: Array<PocketResponse>;
  savingGoal?: Maybe<SavingGoalResponse>;
  savingGoals: Array<SavingGoalResponse>;
  transaction?: Maybe<TransactionResponse>;
  transactionCategories: Array<TransactionCategoryResponse>;
  transactionCategory?: Maybe<TransactionCategoryResponse>;
  transactions: Array<TransactionResponse>;
  transactionsByPocket: Array<TransactionResponse>;
  transactionsBySavingGoal: Array<TransactionResponse>;
};


export type QueryActivitiesArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: NameSort;
};


export type QueryActivityArgs = {
  id: Scalars['Int']['input'];
};


export type QueryActivityExpensesArgs = {
  activityId: Scalars['Int']['input'];
};


export type QueryGroupsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: NameSort;
};


export type QueryPocketArgs = {
  id: Scalars['Int']['input'];
};


export type QueryPocketsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: PocketSort;
};


export type QuerySavingGoalArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySavingGoalsArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: SavingGoalSort;
  status?: SavingGoalStatus;
};


export type QueryTransactionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTransactionCategoriesArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: NameSort;
};


export type QueryTransactionCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTransactionsArgs = {
  filter?: InputMaybe<TransactionFilterInput>;
  sort?: TransactionSort;
};


export type QueryTransactionsByPocketArgs = {
  pocketId: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: TransactionSort;
  type?: InputMaybe<TransactionType>;
};


export type QueryTransactionsBySavingGoalArgs = {
  savingGoalId: Scalars['Int']['input'];
};

export type RemoveActivityMemberError = RequestError;

export type RemoveActivityMemberInput = {
  activityId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type RemoveActivityMemberPayload = {
  __typename?: 'RemoveActivityMemberPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<RemoveActivityMemberError>>;
};

export type RemoveGroupMemberError = RequestError;

export type RemoveGroupMemberInput = {
  groupId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

export type RemoveGroupMemberPayload = {
  __typename?: 'RemoveGroupMemberPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<RemoveGroupMemberError>>;
};

export type RequestError = Error & {
  __typename?: 'RequestError';
  message: Scalars['String']['output'];
};

export type SavingGoalResponse = {
  __typename?: 'SavingGoalResponse';
  deadline?: Maybe<Scalars['LocalDate']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  isCompleted: Scalars['Boolean']['output'];
  isOverdue: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  pocketId: Scalars['Int']['output'];
  remainingAmount: Scalars['Decimal']['output'];
  requiredMonthly?: Maybe<Scalars['Decimal']['output']>;
  requiredWeekly?: Maybe<Scalars['Decimal']['output']>;
  savedAmount: Scalars['Decimal']['output'];
  targetAmount: Scalars['Decimal']['output'];
};

export type SavingGoalSort =
  | 'DEADLINE_ASC'
  | 'NAME_ASC'
  | 'PROGRESS_DESC'
  | 'REMAINING_ASC'
  | 'TARGET_DESC';

export type SavingGoalStatus =
  | 'ACTIVE'
  | 'ALL'
  | 'COMPLETED'
  | 'OVERDUE';

export type SplitInput = {
  exactAmount?: InputMaybe<Scalars['Decimal']['input']>;
  percentage?: InputMaybe<Scalars['Decimal']['input']>;
  userId: Scalars['Int']['input'];
};

export type SplitType =
  | 'EQUAL'
  | 'EXACT'
  | 'PERCENTAGE'
  | 'UNDEFINED';

export type TransactionCategoryResponse = {
  __typename?: 'TransactionCategoryResponse';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  transactions: Array<TransactionResponse>;
};

export type TransactionFilterInput = {
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  fromDate?: InputMaybe<Scalars['LocalDate']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  toDate?: InputMaybe<Scalars['LocalDate']['input']>;
  type?: InputMaybe<TransactionType>;
  uncategorized?: Scalars['Boolean']['input'];
};

export type TransactionResponse = {
  __typename?: 'TransactionResponse';
  amount: Scalars['Decimal']['output'];
  category?: Maybe<TransactionCategoryResponse>;
  categoryId?: Maybe<Scalars['Int']['output']>;
  date: Scalars['LocalDate']['output'];
  fromPocketId?: Maybe<Scalars['Int']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  savingGoalId?: Maybe<Scalars['Int']['output']>;
  toPocketId?: Maybe<Scalars['Int']['output']>;
  type: TransactionType;
};

export type TransactionSort =
  | 'AMOUNT_ASC'
  | 'AMOUNT_DESC'
  | 'DATE_ASC'
  | 'DATE_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC';

export type TransactionType =
  | 'EXPENSE'
  | 'INCOME'
  | 'TRANSFER'
  | 'UNDEFINED';

export type UpdatePocketError = RequestError;

export type UpdatePocketInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  parentPocketId?: InputMaybe<Scalars['Int']['input']>;
  startingAmount: Scalars['Decimal']['input'];
};

export type UpdatePocketPayload = {
  __typename?: 'UpdatePocketPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdatePocketError>>;
};

export type UpdateSavingGoalError = RequestError;

export type UpdateSavingGoalInput = {
  deadline?: InputMaybe<Scalars['LocalDate']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  pocketId: Scalars['Int']['input'];
  targetAmount: Scalars['Decimal']['input'];
};

export type UpdateSavingGoalPayload = {
  __typename?: 'UpdateSavingGoalPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateSavingGoalError>>;
};

export type UpdateTransactionCategoryError = RequestError;

export type UpdateTransactionCategoryInput = {
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type UpdateTransactionCategoryPayload = {
  __typename?: 'UpdateTransactionCategoryPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateTransactionCategoryError>>;
};

export type UpdateTransactionError = RequestError;

export type UpdateTransactionInput = {
  amount: Scalars['Decimal']['input'];
  categoryId?: InputMaybe<Scalars['Int']['input']>;
  date: Scalars['LocalDate']['input'];
  fromPocketId?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  savingGoalId?: InputMaybe<Scalars['Int']['input']>;
  toPocketId?: InputMaybe<Scalars['Int']['input']>;
  type: TransactionType;
};

export type UpdateTransactionPayload = {
  __typename?: 'UpdateTransactionPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateTransactionError>>;
};

export type TransactionFieldsFragment = { __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, fromPocketId?: number | null, toPocketId?: number | null, savingGoalId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null };

export type TransactionsQueryVariables = Exact<{
  filter?: InputMaybe<TransactionFilterInput>;
  sort?: InputMaybe<TransactionSort>;
}>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, fromPocketId?: number | null, toPocketId?: number | null, savingGoalId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null }> };

export type TransactionsByPocketQueryVariables = Exact<{
  pocketId: Scalars['Int']['input'];
  search?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<TransactionType>;
  sort?: InputMaybe<TransactionSort>;
}>;


export type TransactionsByPocketQuery = { __typename?: 'Query', transactionsByPocket: Array<{ __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, fromPocketId?: number | null, toPocketId?: number | null, savingGoalId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null }> };

export type TransactionsBySavingGoalQueryVariables = Exact<{
  savingGoalId: Scalars['Int']['input'];
}>;


export type TransactionsBySavingGoalQuery = { __typename?: 'Query', transactionsBySavingGoal: Array<{ __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, fromPocketId?: number | null, toPocketId?: number | null, savingGoalId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null }> };

export type TransactionCategoriesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<NameSort>;
}>;


export type TransactionCategoriesQuery = { __typename?: 'Query', transactionCategories: Array<{ __typename?: 'TransactionCategoryResponse', id: number, name: string }> };

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'CreateTransactionPayload', id?: number | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type UpdateTransactionMutationVariables = Exact<{
  input: UpdateTransactionInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'UpdateTransactionPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type DeleteTransactionMutationVariables = Exact<{
  input: DeleteTransactionInput;
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: { __typename?: 'DeleteTransactionPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type CreateTransactionCategoryMutationVariables = Exact<{
  input: CreateTransactionCategoryInput;
}>;


export type CreateTransactionCategoryMutation = { __typename?: 'Mutation', createTransactionCategory: { __typename?: 'CreateTransactionCategoryPayload', id?: number | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type UpdateTransactionCategoryMutationVariables = Exact<{
  input: UpdateTransactionCategoryInput;
}>;


export type UpdateTransactionCategoryMutation = { __typename?: 'Mutation', updateTransactionCategory: { __typename?: 'UpdateTransactionCategoryPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type DeleteTransactionCategoryMutationVariables = Exact<{
  input: DeleteTransactionCategoryInput;
}>;


export type DeleteTransactionCategoryMutation = { __typename?: 'Mutation', deleteTransactionCategory: { __typename?: 'DeleteTransactionCategoryPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type SavingGoalFieldsFragment = { __typename?: 'SavingGoalResponse', id: number, name: string, description?: string | null, targetAmount: number, deadline?: string | null, pocketId: number, savedAmount: number, remainingAmount: number, isCompleted: boolean, requiredMonthly?: number | null, requiredWeekly?: number | null, isOverdue: boolean };

export type SavingGoalsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<SavingGoalStatus>;
  sort?: InputMaybe<SavingGoalSort>;
}>;


export type SavingGoalsQuery = { __typename?: 'Query', savingGoals: Array<{ __typename?: 'SavingGoalResponse', id: number, name: string, description?: string | null, targetAmount: number, deadline?: string | null, pocketId: number, savedAmount: number, remainingAmount: number, isCompleted: boolean, requiredMonthly?: number | null, requiredWeekly?: number | null, isOverdue: boolean }> };

export type CreateSavingGoalMutationVariables = Exact<{
  input: CreateSavingGoalInput;
}>;


export type CreateSavingGoalMutation = { __typename?: 'Mutation', createSavingGoal: { __typename?: 'CreateSavingGoalPayload', id?: number | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type UpdateSavingGoalMutationVariables = Exact<{
  input: UpdateSavingGoalInput;
}>;


export type UpdateSavingGoalMutation = { __typename?: 'Mutation', updateSavingGoal: { __typename?: 'UpdateSavingGoalPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type DeleteSavingGoalMutationVariables = Exact<{
  input: DeleteSavingGoalInput;
}>;


export type DeleteSavingGoalMutation = { __typename?: 'Mutation', deleteSavingGoal: { __typename?: 'DeleteSavingGoalPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type PocketFieldsFragment = { __typename?: 'PocketResponse', id: number, name: string, description?: string | null, parentPocketId?: number | null, startingAmount: number, balance: number };

export type PocketsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<PocketSort>;
}>;


export type PocketsQuery = { __typename?: 'Query', pockets: Array<{ __typename?: 'PocketResponse', id: number, name: string, description?: string | null, parentPocketId?: number | null, startingAmount: number, balance: number }> };

export type CreatePocketMutationVariables = Exact<{
  input: CreatePocketInput;
}>;


export type CreatePocketMutation = { __typename?: 'Mutation', createPocket: { __typename?: 'CreatePocketPayload', id?: number | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type UpdatePocketMutationVariables = Exact<{
  input: UpdatePocketInput;
}>;


export type UpdatePocketMutation = { __typename?: 'Mutation', updatePocket: { __typename?: 'UpdatePocketPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type DeletePocketMutationVariables = Exact<{
  input: DeletePocketInput;
}>;


export type DeletePocketMutation = { __typename?: 'Mutation', deletePocket: { __typename?: 'DeletePocketPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type ActivityFieldsFragment = { __typename?: 'ActivityResponse', id: number, name: string, description?: string | null, createdByUserId: number, members: Array<{ __typename?: 'ActivityMemberResponse', userId: number, displayName?: string | null, email?: string | null }>, balances: Array<{ __typename?: 'ActivityBalanceResponse', userId: number, net: number }>, settlements: Array<{ __typename?: 'ActivitySettlementResponse', fromUserId: number, toUserId: number, amount: number }> };

export type ActivityExpenseFieldsFragment = { __typename?: 'ActivityExpenseResponse', id: number, activityId: number, description: string, date: string, amount: number, paidByUserId: number, splitType: SplitType, splits: Array<{ __typename?: 'ActivityExpenseSplitResponse', userId: number, amount: number, percentage?: number | null }> };

export type ActivitiesQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<NameSort>;
}>;


export type ActivitiesQuery = { __typename?: 'Query', activities: Array<{ __typename?: 'ActivityResponse', id: number, name: string, description?: string | null, createdByUserId: number, members: Array<{ __typename?: 'ActivityMemberResponse', userId: number, displayName?: string | null, email?: string | null }>, balances: Array<{ __typename?: 'ActivityBalanceResponse', userId: number, net: number }>, settlements: Array<{ __typename?: 'ActivitySettlementResponse', fromUserId: number, toUserId: number, amount: number }> }> };

export type ActivityQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type ActivityQuery = { __typename?: 'Query', activity?: { __typename?: 'ActivityResponse', id: number, name: string, description?: string | null, createdByUserId: number, members: Array<{ __typename?: 'ActivityMemberResponse', userId: number, displayName?: string | null, email?: string | null }>, balances: Array<{ __typename?: 'ActivityBalanceResponse', userId: number, net: number }>, settlements: Array<{ __typename?: 'ActivitySettlementResponse', fromUserId: number, toUserId: number, amount: number }> } | null };

export type ActivityExpensesQueryVariables = Exact<{
  activityId: Scalars['Int']['input'];
}>;


export type ActivityExpensesQuery = { __typename?: 'Query', activityExpenses: Array<{ __typename?: 'ActivityExpenseResponse', id: number, activityId: number, description: string, date: string, amount: number, paidByUserId: number, splitType: SplitType, splits: Array<{ __typename?: 'ActivityExpenseSplitResponse', userId: number, amount: number, percentage?: number | null }> }> };

export type CreateActivityMutationVariables = Exact<{
  input: CreateActivityInput;
}>;


export type CreateActivityMutation = { __typename?: 'Mutation', createActivity: { __typename?: 'CreateActivityPayload', id?: number | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type DeleteActivityMutationVariables = Exact<{
  input: DeleteActivityInput;
}>;


export type DeleteActivityMutation = { __typename?: 'Mutation', deleteActivity: { __typename?: 'DeleteActivityPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type AddActivityMemberMutationVariables = Exact<{
  input: AddActivityMemberInput;
}>;


export type AddActivityMemberMutation = { __typename?: 'Mutation', addActivityMember: { __typename?: 'AddActivityMemberPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type RemoveActivityMemberMutationVariables = Exact<{
  input: RemoveActivityMemberInput;
}>;


export type RemoveActivityMemberMutation = { __typename?: 'Mutation', removeActivityMember: { __typename?: 'RemoveActivityMemberPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type CreateActivityExpenseMutationVariables = Exact<{
  input: CreateActivityExpenseInput;
}>;


export type CreateActivityExpenseMutation = { __typename?: 'Mutation', createActivityExpense: { __typename?: 'CreateActivityExpensePayload', id?: number | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type DeleteActivityExpenseMutationVariables = Exact<{
  input: DeleteActivityExpenseInput;
}>;


export type DeleteActivityExpenseMutation = { __typename?: 'Mutation', deleteActivityExpense: { __typename?: 'DeleteActivityExpensePayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type MyContextsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyContextsQuery = { __typename?: 'Query', myContexts: Array<{ __typename?: 'OwnerContextResponse', ownerId: number, kind: OwnerKind, name: string }> };

export type GroupFieldsFragment = { __typename?: 'GroupResponse', id: number, ownerId: number, name: string, description?: string | null, createdByUserId: number, members: Array<{ __typename?: 'GroupMemberResponse', userId: number, displayName?: string | null, email?: string | null }> };

export type GroupsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  sort?: InputMaybe<NameSort>;
}>;


export type GroupsQuery = { __typename?: 'Query', groups: Array<{ __typename?: 'GroupResponse', id: number, ownerId: number, name: string, description?: string | null, createdByUserId: number, members: Array<{ __typename?: 'GroupMemberResponse', userId: number, displayName?: string | null, email?: string | null }> }> };

export type CreateGroupMutationVariables = Exact<{
  input: CreateGroupInput;
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'CreateGroupPayload', ownerId?: number | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type AddGroupMemberMutationVariables = Exact<{
  input: AddGroupMemberInput;
}>;


export type AddGroupMemberMutation = { __typename?: 'Mutation', addGroupMember: { __typename?: 'AddGroupMemberPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type RemoveGroupMemberMutationVariables = Exact<{
  input: RemoveGroupMemberInput;
}>;


export type RemoveGroupMemberMutation = { __typename?: 'Mutation', removeGroupMember: { __typename?: 'RemoveGroupMemberPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type LeaveGroupMutationVariables = Exact<{
  input: LeaveGroupInput;
}>;


export type LeaveGroupMutation = { __typename?: 'Mutation', leaveGroup: { __typename?: 'LeaveGroupPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export type DeleteGroupMutationVariables = Exact<{
  input: DeleteGroupInput;
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: { __typename?: 'DeleteGroupPayload', boolean?: boolean | null, errors?: Array<{ __typename?: 'RequestError', message: string }> | null } };

export const TransactionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionFieldsFragment, unknown>;
export const SavingGoalFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SavingGoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SavingGoalResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"targetAmount"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"pocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"requiredMonthly"}},{"kind":"Field","name":{"kind":"Name","value":"requiredWeekly"}},{"kind":"Field","name":{"kind":"Name","value":"isOverdue"}}]}}]} as unknown as DocumentNode<SavingGoalFieldsFragment, unknown>;
export const PocketFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PocketFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PocketResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"startingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]} as unknown as DocumentNode<PocketFieldsFragment, unknown>;
export const ActivityFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"net"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fromUserId"}},{"kind":"Field","name":{"kind":"Name","value":"toUserId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode<ActivityFieldsFragment, unknown>;
export const ActivityExpenseFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityExpenseResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"splitType"}},{"kind":"Field","name":{"kind":"Name","value":"splits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]} as unknown as DocumentNode<ActivityExpenseFieldsFragment, unknown>;
export const GroupFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroupResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GroupFieldsFragment, unknown>;
export const TransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Transactions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filter"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionFilterInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactions"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filter"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionsQuery, TransactionsQueryVariables>;
export const TransactionsByPocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionsByPocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pocketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionType"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionsByPocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pocketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pocketId"}}},{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionsByPocketQuery, TransactionsByPocketQueryVariables>;
export const TransactionsBySavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionsBySavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"savingGoalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionsBySavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"savingGoalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"savingGoalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionsBySavingGoalQuery, TransactionsBySavingGoalQueryVariables>;
export const TransactionCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionCategories"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NameSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionCategories"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>;
export const CreateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const UpdateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const DeleteTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const CreateTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTransactionCategoryMutation, CreateTransactionCategoryMutationVariables>;
export const UpdateTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionCategoryMutation, UpdateTransactionCategoryMutationVariables>;
export const DeleteTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionCategoryMutation, DeleteTransactionCategoryMutationVariables>;
export const SavingGoalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SavingGoals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SavingGoalStatus"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"SavingGoalSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savingGoals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SavingGoalFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SavingGoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SavingGoalResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"targetAmount"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"pocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"requiredMonthly"}},{"kind":"Field","name":{"kind":"Name","value":"requiredWeekly"}},{"kind":"Field","name":{"kind":"Name","value":"isOverdue"}}]}}]} as unknown as DocumentNode<SavingGoalsQuery, SavingGoalsQueryVariables>;
export const CreateSavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSavingGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateSavingGoalMutation, CreateSavingGoalMutationVariables>;
export const UpdateSavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSavingGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSavingGoalMutation, UpdateSavingGoalMutationVariables>;
export const DeleteSavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSavingGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteSavingGoalMutation, DeleteSavingGoalMutationVariables>;
export const PocketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Pockets"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PocketSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pockets"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PocketFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PocketFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PocketResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"startingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]} as unknown as DocumentNode<PocketsQuery, PocketsQueryVariables>;
export const CreatePocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePocketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreatePocketMutation, CreatePocketMutationVariables>;
export const UpdatePocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePocketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePocketMutation, UpdatePocketMutationVariables>;
export const DeletePocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePocketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeletePocketMutation, DeletePocketMutationVariables>;
export const ActivitiesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Activities"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NameSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activities"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"net"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fromUserId"}},{"kind":"Field","name":{"kind":"Name","value":"toUserId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode<ActivitiesQuery, ActivitiesQueryVariables>;
export const ActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Activity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}},{"kind":"Field","name":{"kind":"Name","value":"balances"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"net"}}]}},{"kind":"Field","name":{"kind":"Name","value":"settlements"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fromUserId"}},{"kind":"Field","name":{"kind":"Name","value":"toUserId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}}]}}]}}]} as unknown as DocumentNode<ActivityQuery, ActivityQueryVariables>;
export const ActivityExpensesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ActivityExpenses"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"activityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"activityExpenses"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"activityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"activityId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ActivityExpenseFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ActivityExpenseFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ActivityExpenseResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"activityId"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"paidByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"splitType"}},{"kind":"Field","name":{"kind":"Name","value":"splits"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"percentage"}}]}}]}}]} as unknown as DocumentNode<ActivityExpensesQuery, ActivityExpensesQueryVariables>;
export const CreateActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateActivityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateActivityMutation, CreateActivityMutationVariables>;
export const DeleteActivityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteActivity"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteActivityInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteActivity"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteActivityMutation, DeleteActivityMutationVariables>;
export const AddActivityMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddActivityMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddActivityMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addActivityMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddActivityMemberMutation, AddActivityMemberMutationVariables>;
export const RemoveActivityMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveActivityMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveActivityMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeActivityMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveActivityMemberMutation, RemoveActivityMemberMutationVariables>;
export const CreateActivityExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateActivityExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateActivityExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createActivityExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateActivityExpenseMutation, CreateActivityExpenseMutationVariables>;
export const DeleteActivityExpenseDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteActivityExpense"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteActivityExpenseInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteActivityExpense"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteActivityExpenseMutation, DeleteActivityExpenseMutationVariables>;
export const MyContextsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MyContexts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"myContexts"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"kind"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<MyContextsQuery, MyContextsQueryVariables>;
export const GroupsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Groups"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"search"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sort"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"NameSort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groups"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"search"},"value":{"kind":"Variable","name":{"kind":"Name","value":"search"}}},{"kind":"Argument","name":{"kind":"Name","value":"sort"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sort"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"GroupFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"GroupFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"GroupResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdByUserId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GroupsQuery, GroupsQueryVariables>;
export const CreateGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ownerId"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateGroupMutation, CreateGroupMutationVariables>;
export const AddGroupMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddGroupMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddGroupMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addGroupMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<AddGroupMemberMutation, AddGroupMemberMutationVariables>;
export const RemoveGroupMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveGroupMember"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"RemoveGroupMemberInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeGroupMember"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<RemoveGroupMemberMutation, RemoveGroupMemberMutationVariables>;
export const LeaveGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LeaveGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LeaveGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"leaveGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<LeaveGroupMutation, LeaveGroupMutationVariables>;
export const DeleteGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteGroupInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteGroupMutation, DeleteGroupMutationVariables>;