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
  name: Scalars['String']['input'];
  type: TransactionType;
};

export type CreateTransactionPayload = {
  __typename?: 'CreateTransactionPayload';
  errors?: Maybe<Array<CreateTransactionError>>;
  id?: Maybe<Scalars['Int']['output']>;
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
  createTransaction: CreateTransactionPayload;
  createTransactionCategory: CreateTransactionCategoryPayload;
  deleteTransaction: DeleteTransactionPayload;
  deleteTransactionCategory: DeleteTransactionCategoryPayload;
  updateTransaction: UpdateTransactionPayload;
  updateTransactionCategory: UpdateTransactionCategoryPayload;
};


export type MutationCreateTransactionArgs = {
  input: CreateTransactionInput;
};


export type MutationCreateTransactionCategoryArgs = {
  input: CreateTransactionCategoryInput;
};


export type MutationDeleteTransactionArgs = {
  input: DeleteTransactionInput;
};


export type MutationDeleteTransactionCategoryArgs = {
  input: DeleteTransactionCategoryInput;
};


export type MutationUpdateTransactionArgs = {
  input: UpdateTransactionInput;
};


export type MutationUpdateTransactionCategoryArgs = {
  input: UpdateTransactionCategoryInput;
};

export type Query = {
  __typename?: 'Query';
  transaction?: Maybe<TransactionResponse>;
  transactionCategories: Array<TransactionCategoryResponse>;
  transactionCategory?: Maybe<TransactionCategoryResponse>;
  transactions: Array<TransactionResponse>;
};


export type QueryTransactionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTransactionCategoryArgs = {
  id: Scalars['Int']['input'];
};

export type RequestError = Error & {
  __typename?: 'RequestError';
  message: Scalars['String']['output'];
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
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  type: TransactionType;
};

export type TransactionType =
  | 'EXPENSE'
  | 'INCOME'
  | 'UNDEFINED';

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
  id: Scalars['Int']['input'];
  name: Scalars['String']['input'];
  type: TransactionType;
};

export type UpdateTransactionPayload = {
  __typename?: 'UpdateTransactionPayload';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  errors?: Maybe<Array<UpdateTransactionError>>;
};

export type TransactionFieldsFragment = { __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null };

export type TransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type TransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'TransactionResponse', id: number, name: string, date: string, amount: number, type: TransactionType, categoryId?: number | null, category?: { __typename?: 'TransactionCategoryResponse', id: number, name: string } | null }> };

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

export const TransactionFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionFieldsFragment, unknown>;
export const TransactionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TransactionFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TransactionFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TransactionResponse"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"date"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"categoryId"}},{"kind":"Field","name":{"kind":"Name","value":"category"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionsQuery, TransactionsQueryVariables>;
export const TransactionCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"TransactionCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transactionCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<TransactionCategoriesQuery, TransactionCategoriesQueryVariables>;
export const CreateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const UpdateTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const DeleteTransactionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransaction"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTransactionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransaction"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const CreateTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<CreateTransactionCategoryMutation, CreateTransactionCategoryMutationVariables>;
export const UpdateTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UpdateTransactionCategoryMutation, UpdateTransactionCategoryMutationVariables>;
export const DeleteTransactionCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTransactionCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"DeleteTransactionCategoryInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTransactionCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boolean"}},{"kind":"Field","name":{"kind":"Name","value":"errors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"RequestError"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]}}]}}]} as unknown as DocumentNode<DeleteTransactionCategoryMutation, DeleteTransactionCategoryMutationVariables>;