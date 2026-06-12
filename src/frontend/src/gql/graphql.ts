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

export type Mutation = {
  __typename?: 'Mutation';
  createPocket: CreatePocketPayload;
  createSavingGoal: CreateSavingGoalPayload;
  createTransaction: CreateTransactionPayload;
  createTransactionCategory: CreateTransactionCategoryPayload;
  deletePocket: DeletePocketPayload;
  deleteSavingGoal: DeleteSavingGoalPayload;
  deleteTransaction: DeleteTransactionPayload;
  deleteTransactionCategory: DeleteTransactionCategoryPayload;
  updatePocket: UpdatePocketPayload;
  updateSavingGoal: UpdateSavingGoalPayload;
  updateTransaction: UpdateTransactionPayload;
  updateTransactionCategory: UpdateTransactionCategoryPayload;
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

export type PocketResponse = {
  __typename?: 'PocketResponse';
  balance: Scalars['Decimal']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  parentPocketId?: Maybe<Scalars['Int']['output']>;
  startingAmount: Scalars['Decimal']['output'];
};

export type Query = {
  __typename?: 'Query';
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


export type QueryPocketArgs = {
  id: Scalars['Int']['input'];
};


export type QuerySavingGoalArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTransactionCategoryArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTransactionsByPocketArgs = {
  pocketId: Scalars['Int']['input'];
};


export type QueryTransactionsBySavingGoalArgs = {
  savingGoalId: Scalars['Int']['input'];
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

export type TransactionCategoryResponse = {
  __typename?: 'TransactionCategoryResponse';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  transactions: Array<TransactionResponse>;
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

export type TransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, fromPocketId?: number | null, toPocketId?: number | null, savingGoalId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null }> };

export type TransactionsByPocketQueryVariables = Exact<{
  pocketId: Scalars['Int']['input'];
}>;


export type TransactionsByPocketQuery = { __typename?: 'Query', transactionsByPocket: Array<{ __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, fromPocketId?: number | null, toPocketId?: number | null, savingGoalId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null }> };

export type TransactionsBySavingGoalQueryVariables = Exact<{
  savingGoalId: Scalars['Int']['input'];
}>;


export type TransactionsBySavingGoalQuery = { __typename?: 'Query', transactionsBySavingGoal: Array<{ __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, fromPocketId?: number | null, toPocketId?: number | null, savingGoalId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null }> };

export type TransactionCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


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

export type SavingGoalsQueryVariables = Exact<{ [key: string]: never; }>;


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

export type PocketsQueryVariables = Exact<{ [key: string]: never; }>;


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

export const TransactionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionFieldsFragment, unknown>;
export const SavingGoalFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SavingGoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SavingGoalResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"targetAmount"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"pocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"requiredMonthly"}},{"kind":"Field","name":{"kind":"Name","value":"requiredWeekly"}},{"kind":"Field","name":{"kind":"Name","value":"isOverdue"}}]}}]} as unknown as DocumentNode<SavingGoalFieldsFragment, unknown>;
export const PocketFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PocketFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PocketResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"startingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]} as unknown as DocumentNode<PocketFieldsFragment, unknown>;
export const TransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionsQuery, TransactionsQueryVariables>;
export const TransactionsByPocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionsByPocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pocketId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionsByPocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"pocketId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pocketId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionsByPocketQuery, TransactionsByPocketQueryVariables>;
export const TransactionsBySavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionsBySavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"savingGoalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionsBySavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"savingGoalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"savingGoalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"fromPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"toPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savingGoalId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionsBySavingGoalQuery, TransactionsBySavingGoalQueryVariables>;
export const TransactionCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>;
export const CreateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const UpdateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const DeleteTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const CreateTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTransactionCategoryMutation, CreateTransactionCategoryMutationVariables>;
export const UpdateTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionCategoryMutation, UpdateTransactionCategoryMutationVariables>;
export const DeleteTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionCategoryMutation, DeleteTransactionCategoryMutationVariables>;
export const SavingGoalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SavingGoals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"savingGoals"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"SavingGoalFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"SavingGoalFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"SavingGoalResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"targetAmount"}},{"kind":"Field","name":{"kind":"Name","value":"deadline"}},{"kind":"Field","name":{"kind":"Name","value":"pocketId"}},{"kind":"Field","name":{"kind":"Name","value":"savedAmount"}},{"kind":"Field","name":{"kind":"Name","value":"remainingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"isCompleted"}},{"kind":"Field","name":{"kind":"Name","value":"requiredMonthly"}},{"kind":"Field","name":{"kind":"Name","value":"requiredWeekly"}},{"kind":"Field","name":{"kind":"Name","value":"isOverdue"}}]}}]} as unknown as DocumentNode<SavingGoalsQuery, SavingGoalsQueryVariables>;
export const CreateSavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateSavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateSavingGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createSavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateSavingGoalMutation, CreateSavingGoalMutationVariables>;
export const UpdateSavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateSavingGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateSavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateSavingGoalMutation, UpdateSavingGoalMutationVariables>;
export const DeleteSavingGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSavingGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteSavingGoalInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSavingGoal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteSavingGoalMutation, DeleteSavingGoalMutationVariables>;
export const PocketsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Pockets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pockets"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PocketFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PocketFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"PocketResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"parentPocketId"}},{"kind":"Field","name":{"kind":"Name","value":"startingAmount"}},{"kind":"Field","name":{"kind":"Name","value":"balance"}}]}}]} as unknown as DocumentNode<PocketsQuery, PocketsQueryVariables>;
export const CreatePocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreatePocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePocketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreatePocketMutation, CreatePocketMutationVariables>;
export const UpdatePocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdatePocketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdatePocketMutation, UpdatePocketMutationVariables>;
export const DeletePocketDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeletePocket"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeletePocketInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePocket"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeletePocketMutation, DeletePocketMutationVariables>;