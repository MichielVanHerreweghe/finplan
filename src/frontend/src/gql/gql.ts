/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  fragment TransactionFields on TransactionResponse {\n    id\n    name\n    date\n    amount\n    type\n    categoryId\n    fromPocketId\n    toPocketId\n    savingGoalId\n    category {\n      id\n      name\n    }\n  }\n": typeof types.TransactionFieldsFragmentDoc,
    "\n  query Transactions {\n    transactions {\n      ...TransactionFields\n    }\n  }\n": typeof types.TransactionsDocument,
    "\n  query TransactionsByPocket($pocketId: Int!) {\n    transactionsByPocket(pocketId: $pocketId) {\n      ...TransactionFields\n    }\n  }\n": typeof types.TransactionsByPocketDocument,
    "\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n": typeof types.TransactionsBySavingGoalDocument,
    "\n  query TransactionCategories {\n    transactionCategories {\n      id\n      name\n    }\n  }\n": typeof types.TransactionCategoriesDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdateTransactionDocument,
    "\n  mutation DeleteTransaction($input: DeleteTransactionInput!) {\n    deleteTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteTransactionDocument,
    "\n  mutation CreateTransactionCategory($input: CreateTransactionCategoryInput!) {\n    createTransactionCategory(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateTransactionCategoryDocument,
    "\n  mutation UpdateTransactionCategory($input: UpdateTransactionCategoryInput!) {\n    updateTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdateTransactionCategoryDocument,
    "\n  mutation DeleteTransactionCategory($input: DeleteTransactionCategoryInput!) {\n    deleteTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteTransactionCategoryDocument,
    "\n  fragment SavingGoalFields on SavingGoalResponse {\n    id\n    name\n    description\n    targetAmount\n    deadline\n    pocketId\n    savedAmount\n    remainingAmount\n    isCompleted\n    requiredMonthly\n    requiredWeekly\n    isOverdue\n  }\n": typeof types.SavingGoalFieldsFragmentDoc,
    "\n  query SavingGoals {\n    savingGoals {\n      ...SavingGoalFields\n    }\n  }\n": typeof types.SavingGoalsDocument,
    "\n  mutation CreateSavingGoal($input: CreateSavingGoalInput!) {\n    createSavingGoal(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateSavingGoalDocument,
    "\n  mutation UpdateSavingGoal($input: UpdateSavingGoalInput!) {\n    updateSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdateSavingGoalDocument,
    "\n  mutation DeleteSavingGoal($input: DeleteSavingGoalInput!) {\n    deleteSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteSavingGoalDocument,
    "\n  fragment PocketFields on PocketResponse {\n    id\n    name\n    description\n    parentPocketId\n    startingAmount\n    balance\n  }\n": typeof types.PocketFieldsFragmentDoc,
    "\n  query Pockets {\n    pockets {\n      ...PocketFields\n    }\n  }\n": typeof types.PocketsDocument,
    "\n  mutation CreatePocket($input: CreatePocketInput!) {\n    createPocket(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreatePocketDocument,
    "\n  mutation UpdatePocket($input: UpdatePocketInput!) {\n    updatePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdatePocketDocument,
    "\n  mutation DeletePocket($input: DeletePocketInput!) {\n    deletePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeletePocketDocument,
};
const documents: Documents = {
    "\n  fragment TransactionFields on TransactionResponse {\n    id\n    name\n    date\n    amount\n    type\n    categoryId\n    fromPocketId\n    toPocketId\n    savingGoalId\n    category {\n      id\n      name\n    }\n  }\n": types.TransactionFieldsFragmentDoc,
    "\n  query Transactions {\n    transactions {\n      ...TransactionFields\n    }\n  }\n": types.TransactionsDocument,
    "\n  query TransactionsByPocket($pocketId: Int!) {\n    transactionsByPocket(pocketId: $pocketId) {\n      ...TransactionFields\n    }\n  }\n": types.TransactionsByPocketDocument,
    "\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n": types.TransactionsBySavingGoalDocument,
    "\n  query TransactionCategories {\n    transactionCategories {\n      id\n      name\n    }\n  }\n": types.TransactionCategoriesDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdateTransactionDocument,
    "\n  mutation DeleteTransaction($input: DeleteTransactionInput!) {\n    deleteTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteTransactionDocument,
    "\n  mutation CreateTransactionCategory($input: CreateTransactionCategoryInput!) {\n    createTransactionCategory(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateTransactionCategoryDocument,
    "\n  mutation UpdateTransactionCategory($input: UpdateTransactionCategoryInput!) {\n    updateTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdateTransactionCategoryDocument,
    "\n  mutation DeleteTransactionCategory($input: DeleteTransactionCategoryInput!) {\n    deleteTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteTransactionCategoryDocument,
    "\n  fragment SavingGoalFields on SavingGoalResponse {\n    id\n    name\n    description\n    targetAmount\n    deadline\n    pocketId\n    savedAmount\n    remainingAmount\n    isCompleted\n    requiredMonthly\n    requiredWeekly\n    isOverdue\n  }\n": types.SavingGoalFieldsFragmentDoc,
    "\n  query SavingGoals {\n    savingGoals {\n      ...SavingGoalFields\n    }\n  }\n": types.SavingGoalsDocument,
    "\n  mutation CreateSavingGoal($input: CreateSavingGoalInput!) {\n    createSavingGoal(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateSavingGoalDocument,
    "\n  mutation UpdateSavingGoal($input: UpdateSavingGoalInput!) {\n    updateSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdateSavingGoalDocument,
    "\n  mutation DeleteSavingGoal($input: DeleteSavingGoalInput!) {\n    deleteSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteSavingGoalDocument,
    "\n  fragment PocketFields on PocketResponse {\n    id\n    name\n    description\n    parentPocketId\n    startingAmount\n    balance\n  }\n": types.PocketFieldsFragmentDoc,
    "\n  query Pockets {\n    pockets {\n      ...PocketFields\n    }\n  }\n": types.PocketsDocument,
    "\n  mutation CreatePocket($input: CreatePocketInput!) {\n    createPocket(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreatePocketDocument,
    "\n  mutation UpdatePocket($input: UpdatePocketInput!) {\n    updatePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdatePocketDocument,
    "\n  mutation DeletePocket($input: DeletePocketInput!) {\n    deletePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeletePocketDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TransactionFields on TransactionResponse {\n    id\n    name\n    date\n    amount\n    type\n    categoryId\n    fromPocketId\n    toPocketId\n    savingGoalId\n    category {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  fragment TransactionFields on TransactionResponse {\n    id\n    name\n    date\n    amount\n    type\n    categoryId\n    fromPocketId\n    toPocketId\n    savingGoalId\n    category {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Transactions {\n    transactions {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  query Transactions {\n    transactions {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TransactionsByPocket($pocketId: Int!) {\n    transactionsByPocket(pocketId: $pocketId) {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  query TransactionsByPocket($pocketId: Int!) {\n    transactionsByPocket(pocketId: $pocketId) {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TransactionCategories {\n    transactionCategories {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query TransactionCategories {\n    transactionCategories {\n      id\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTransaction($input: DeleteTransactionInput!) {\n    deleteTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTransaction($input: DeleteTransactionInput!) {\n    deleteTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateTransactionCategory($input: CreateTransactionCategoryInput!) {\n    createTransactionCategory(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateTransactionCategory($input: CreateTransactionCategoryInput!) {\n    createTransactionCategory(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateTransactionCategory($input: UpdateTransactionCategoryInput!) {\n    updateTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateTransactionCategory($input: UpdateTransactionCategoryInput!) {\n    updateTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteTransactionCategory($input: DeleteTransactionCategoryInput!) {\n    deleteTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteTransactionCategory($input: DeleteTransactionCategoryInput!) {\n    deleteTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment SavingGoalFields on SavingGoalResponse {\n    id\n    name\n    description\n    targetAmount\n    deadline\n    pocketId\n    savedAmount\n    remainingAmount\n    isCompleted\n    requiredMonthly\n    requiredWeekly\n    isOverdue\n  }\n"): (typeof documents)["\n  fragment SavingGoalFields on SavingGoalResponse {\n    id\n    name\n    description\n    targetAmount\n    deadline\n    pocketId\n    savedAmount\n    remainingAmount\n    isCompleted\n    requiredMonthly\n    requiredWeekly\n    isOverdue\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SavingGoals {\n    savingGoals {\n      ...SavingGoalFields\n    }\n  }\n"): (typeof documents)["\n  query SavingGoals {\n    savingGoals {\n      ...SavingGoalFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateSavingGoal($input: CreateSavingGoalInput!) {\n    createSavingGoal(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateSavingGoal($input: CreateSavingGoalInput!) {\n    createSavingGoal(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateSavingGoal($input: UpdateSavingGoalInput!) {\n    updateSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateSavingGoal($input: UpdateSavingGoalInput!) {\n    updateSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteSavingGoal($input: DeleteSavingGoalInput!) {\n    deleteSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteSavingGoal($input: DeleteSavingGoalInput!) {\n    deleteSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PocketFields on PocketResponse {\n    id\n    name\n    description\n    parentPocketId\n    startingAmount\n    balance\n  }\n"): (typeof documents)["\n  fragment PocketFields on PocketResponse {\n    id\n    name\n    description\n    parentPocketId\n    startingAmount\n    balance\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Pockets {\n    pockets {\n      ...PocketFields\n    }\n  }\n"): (typeof documents)["\n  query Pockets {\n    pockets {\n      ...PocketFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePocket($input: CreatePocketInput!) {\n    createPocket(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePocket($input: CreatePocketInput!) {\n    createPocket(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdatePocket($input: UpdatePocketInput!) {\n    updatePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation UpdatePocket($input: UpdatePocketInput!) {\n    updatePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeletePocket($input: DeletePocketInput!) {\n    deletePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeletePocket($input: DeletePocketInput!) {\n    deletePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;