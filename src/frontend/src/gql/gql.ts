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
    "\n  query Transactions($filter: TransactionFilterInput, $sort: TransactionSort) {\n    transactions(filter: $filter, sort: $sort) {\n      ...TransactionFields\n    }\n  }\n": typeof types.TransactionsDocument,
    "\n  query TransactionsByPocket(\n    $pocketId: Int!\n    $search: String\n    $type: TransactionType\n    $sort: TransactionSort\n  ) {\n    transactionsByPocket(\n      pocketId: $pocketId\n      search: $search\n      type: $type\n      sort: $sort\n    ) {\n      ...TransactionFields\n    }\n  }\n": typeof types.TransactionsByPocketDocument,
    "\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n": typeof types.TransactionsBySavingGoalDocument,
    "\n  query TransactionCategories($search: String, $sort: NameSort) {\n    transactionCategories(search: $search, sort: $sort) {\n      id\n      name\n    }\n  }\n": typeof types.TransactionCategoriesDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdateTransactionDocument,
    "\n  mutation DeleteTransaction($input: DeleteTransactionInput!) {\n    deleteTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteTransactionDocument,
    "\n  mutation CreateTransactionCategory($input: CreateTransactionCategoryInput!) {\n    createTransactionCategory(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateTransactionCategoryDocument,
    "\n  mutation UpdateTransactionCategory($input: UpdateTransactionCategoryInput!) {\n    updateTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdateTransactionCategoryDocument,
    "\n  mutation DeleteTransactionCategory($input: DeleteTransactionCategoryInput!) {\n    deleteTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteTransactionCategoryDocument,
    "\n  fragment SavingGoalFields on SavingGoalResponse {\n    id\n    name\n    description\n    targetAmount\n    deadline\n    pocketId\n    savedAmount\n    remainingAmount\n    isCompleted\n    requiredMonthly\n    requiredWeekly\n    isOverdue\n  }\n": typeof types.SavingGoalFieldsFragmentDoc,
    "\n  query SavingGoals(\n    $search: String\n    $status: SavingGoalStatus\n    $sort: SavingGoalSort\n  ) {\n    savingGoals(search: $search, status: $status, sort: $sort) {\n      ...SavingGoalFields\n    }\n  }\n": typeof types.SavingGoalsDocument,
    "\n  mutation CreateSavingGoal($input: CreateSavingGoalInput!) {\n    createSavingGoal(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateSavingGoalDocument,
    "\n  mutation UpdateSavingGoal($input: UpdateSavingGoalInput!) {\n    updateSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdateSavingGoalDocument,
    "\n  mutation DeleteSavingGoal($input: DeleteSavingGoalInput!) {\n    deleteSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteSavingGoalDocument,
    "\n  fragment PocketFields on PocketResponse {\n    id\n    name\n    description\n    parentPocketId\n    startingAmount\n    balance\n  }\n": typeof types.PocketFieldsFragmentDoc,
    "\n  query Pockets($search: String, $sort: PocketSort) {\n    pockets(search: $search, sort: $sort) {\n      ...PocketFields\n    }\n  }\n": typeof types.PocketsDocument,
    "\n  mutation CreatePocket($input: CreatePocketInput!) {\n    createPocket(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreatePocketDocument,
    "\n  mutation UpdatePocket($input: UpdatePocketInput!) {\n    updatePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.UpdatePocketDocument,
    "\n  mutation DeletePocket($input: DeletePocketInput!) {\n    deletePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeletePocketDocument,
    "\n  fragment ActivityFields on ActivityResponse {\n    id\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n    balances {\n      userId\n      net\n    }\n    settlements {\n      fromUserId\n      toUserId\n      amount\n    }\n  }\n": typeof types.ActivityFieldsFragmentDoc,
    "\n  fragment ActivityExpenseFields on ActivityExpenseResponse {\n    id\n    activityId\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n": typeof types.ActivityExpenseFieldsFragmentDoc,
    "\n  query Activities($search: String, $sort: NameSort) {\n    activities(search: $search, sort: $sort) {\n      ...ActivityFields\n    }\n  }\n": typeof types.ActivitiesDocument,
    "\n  query Activity($id: Int!) {\n    activity(id: $id) {\n      ...ActivityFields\n    }\n  }\n": typeof types.ActivityDocument,
    "\n  query ActivityExpenses($activityId: Int!) {\n    activityExpenses(activityId: $activityId) {\n      ...ActivityExpenseFields\n    }\n  }\n": typeof types.ActivityExpensesDocument,
    "\n  mutation CreateActivity($input: CreateActivityInput!) {\n    createActivity(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateActivityDocument,
    "\n  mutation DeleteActivity($input: DeleteActivityInput!) {\n    deleteActivity(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteActivityDocument,
    "\n  mutation RemoveActivityMember($input: RemoveActivityMemberInput!) {\n    removeActivityMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.RemoveActivityMemberDocument,
    "\n  mutation CreateActivityExpense($input: CreateActivityExpenseInput!) {\n    createActivityExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateActivityExpenseDocument,
    "\n  mutation DeleteActivityExpense($input: DeleteActivityExpenseInput!) {\n    deleteActivityExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteActivityExpenseDocument,
    "\n  query MyContexts {\n    myContexts {\n      ownerId\n      kind\n      name\n    }\n  }\n": typeof types.MyContextsDocument,
    "\n  fragment GroupFields on GroupResponse {\n    id\n    ownerId\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n  }\n": typeof types.GroupFieldsFragmentDoc,
    "\n  query Groups($search: String, $sort: NameSort) {\n    groups(search: $search, sort: $sort) {\n      ...GroupFields\n    }\n  }\n": typeof types.GroupsDocument,
    "\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      ownerId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateGroupDocument,
    "\n  mutation RemoveGroupMember($input: RemoveGroupMemberInput!) {\n    removeGroupMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.RemoveGroupMemberDocument,
    "\n  mutation LeaveGroup($input: LeaveGroupInput!) {\n    leaveGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.LeaveGroupDocument,
    "\n  mutation DeleteGroup($input: DeleteGroupInput!) {\n    deleteGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteGroupDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      displayName\n      firstName\n      lastName\n      profileCompleted\n    }\n  }\n": typeof types.MeDocument,
    "\n  mutation CompleteProfile($input: CompleteProfileInput!) {\n    completeProfile(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CompleteProfileDocument,
    "\n  fragment ContactFields on ContactResponse {\n    id\n    userId\n    displayName\n    firstName\n    lastName\n    email\n    net\n  }\n": typeof types.ContactFieldsFragmentDoc,
    "\n  query Contacts($search: String, $sort: NameSort) {\n    contacts(search: $search, sort: $sort) {\n      ...ContactFields\n    }\n  }\n": typeof types.ContactsDocument,
    "\n  mutation RemoveContact($input: RemoveContactInput!) {\n    removeContact(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.RemoveContactDocument,
    "\n  fragment ContactExpenseFields on ContactExpenseResponse {\n    id\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n": typeof types.ContactExpenseFieldsFragmentDoc,
    "\n  fragment ContactSettlementFields on ContactSettlementResponse {\n    id\n    fromUserId\n    toUserId\n    amount\n    date\n  }\n": typeof types.ContactSettlementFieldsFragmentDoc,
    "\n  query ContactLedger($contactId: Int!) {\n    contactLedger(contactId: $contactId) {\n      contactId\n      userId\n      displayName\n      firstName\n      lastName\n      email\n      net\n      expenses {\n        ...ContactExpenseFields\n      }\n      settlements {\n        ...ContactSettlementFields\n      }\n    }\n  }\n": typeof types.ContactLedgerDocument,
    "\n  mutation CreateContactExpense($input: CreateContactExpenseInput!) {\n    createContactExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.CreateContactExpenseDocument,
    "\n  mutation DeleteContactExpense($input: DeleteContactExpenseInput!) {\n    deleteContactExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteContactExpenseDocument,
    "\n  mutation RecordContactSettlement($input: RecordContactSettlementInput!) {\n    recordContactSettlement(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.RecordContactSettlementDocument,
    "\n  mutation DeleteContactSettlement($input: DeleteContactSettlementInput!) {\n    deleteContactSettlement(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeleteContactSettlementDocument,
    "\n  fragment InvitationFields on InvitationResponse {\n    id\n    type\n    direction\n    otherUserId\n    otherDisplayName\n    otherEmail\n    targetId\n    targetName\n    createdAt\n  }\n": typeof types.InvitationFieldsFragmentDoc,
    "\n  query MyInvitations {\n    myInvitations {\n      ...InvitationFields\n    }\n  }\n": typeof types.MyInvitationsDocument,
    "\n  mutation SendInvitation($input: SendInvitationInput!) {\n    sendInvitation(input: $input) {\n      invitationId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.SendInvitationDocument,
    "\n  mutation AcceptInvitation($input: AcceptInvitationInput!) {\n    acceptInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.AcceptInvitationDocument,
    "\n  mutation DeclineInvitation($input: DeclineInvitationInput!) {\n    declineInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": typeof types.DeclineInvitationDocument,
};
const documents: Documents = {
    "\n  fragment TransactionFields on TransactionResponse {\n    id\n    name\n    date\n    amount\n    type\n    categoryId\n    fromPocketId\n    toPocketId\n    savingGoalId\n    category {\n      id\n      name\n    }\n  }\n": types.TransactionFieldsFragmentDoc,
    "\n  query Transactions($filter: TransactionFilterInput, $sort: TransactionSort) {\n    transactions(filter: $filter, sort: $sort) {\n      ...TransactionFields\n    }\n  }\n": types.TransactionsDocument,
    "\n  query TransactionsByPocket(\n    $pocketId: Int!\n    $search: String\n    $type: TransactionType\n    $sort: TransactionSort\n  ) {\n    transactionsByPocket(\n      pocketId: $pocketId\n      search: $search\n      type: $type\n      sort: $sort\n    ) {\n      ...TransactionFields\n    }\n  }\n": types.TransactionsByPocketDocument,
    "\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n": types.TransactionsBySavingGoalDocument,
    "\n  query TransactionCategories($search: String, $sort: NameSort) {\n    transactionCategories(search: $search, sort: $sort) {\n      id\n      name\n    }\n  }\n": types.TransactionCategoriesDocument,
    "\n  mutation CreateTransaction($input: CreateTransactionInput!) {\n    createTransaction(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateTransactionDocument,
    "\n  mutation UpdateTransaction($input: UpdateTransactionInput!) {\n    updateTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdateTransactionDocument,
    "\n  mutation DeleteTransaction($input: DeleteTransactionInput!) {\n    deleteTransaction(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteTransactionDocument,
    "\n  mutation CreateTransactionCategory($input: CreateTransactionCategoryInput!) {\n    createTransactionCategory(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateTransactionCategoryDocument,
    "\n  mutation UpdateTransactionCategory($input: UpdateTransactionCategoryInput!) {\n    updateTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdateTransactionCategoryDocument,
    "\n  mutation DeleteTransactionCategory($input: DeleteTransactionCategoryInput!) {\n    deleteTransactionCategory(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteTransactionCategoryDocument,
    "\n  fragment SavingGoalFields on SavingGoalResponse {\n    id\n    name\n    description\n    targetAmount\n    deadline\n    pocketId\n    savedAmount\n    remainingAmount\n    isCompleted\n    requiredMonthly\n    requiredWeekly\n    isOverdue\n  }\n": types.SavingGoalFieldsFragmentDoc,
    "\n  query SavingGoals(\n    $search: String\n    $status: SavingGoalStatus\n    $sort: SavingGoalSort\n  ) {\n    savingGoals(search: $search, status: $status, sort: $sort) {\n      ...SavingGoalFields\n    }\n  }\n": types.SavingGoalsDocument,
    "\n  mutation CreateSavingGoal($input: CreateSavingGoalInput!) {\n    createSavingGoal(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateSavingGoalDocument,
    "\n  mutation UpdateSavingGoal($input: UpdateSavingGoalInput!) {\n    updateSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdateSavingGoalDocument,
    "\n  mutation DeleteSavingGoal($input: DeleteSavingGoalInput!) {\n    deleteSavingGoal(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteSavingGoalDocument,
    "\n  fragment PocketFields on PocketResponse {\n    id\n    name\n    description\n    parentPocketId\n    startingAmount\n    balance\n  }\n": types.PocketFieldsFragmentDoc,
    "\n  query Pockets($search: String, $sort: PocketSort) {\n    pockets(search: $search, sort: $sort) {\n      ...PocketFields\n    }\n  }\n": types.PocketsDocument,
    "\n  mutation CreatePocket($input: CreatePocketInput!) {\n    createPocket(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreatePocketDocument,
    "\n  mutation UpdatePocket($input: UpdatePocketInput!) {\n    updatePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.UpdatePocketDocument,
    "\n  mutation DeletePocket($input: DeletePocketInput!) {\n    deletePocket(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeletePocketDocument,
    "\n  fragment ActivityFields on ActivityResponse {\n    id\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n    balances {\n      userId\n      net\n    }\n    settlements {\n      fromUserId\n      toUserId\n      amount\n    }\n  }\n": types.ActivityFieldsFragmentDoc,
    "\n  fragment ActivityExpenseFields on ActivityExpenseResponse {\n    id\n    activityId\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n": types.ActivityExpenseFieldsFragmentDoc,
    "\n  query Activities($search: String, $sort: NameSort) {\n    activities(search: $search, sort: $sort) {\n      ...ActivityFields\n    }\n  }\n": types.ActivitiesDocument,
    "\n  query Activity($id: Int!) {\n    activity(id: $id) {\n      ...ActivityFields\n    }\n  }\n": types.ActivityDocument,
    "\n  query ActivityExpenses($activityId: Int!) {\n    activityExpenses(activityId: $activityId) {\n      ...ActivityExpenseFields\n    }\n  }\n": types.ActivityExpensesDocument,
    "\n  mutation CreateActivity($input: CreateActivityInput!) {\n    createActivity(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateActivityDocument,
    "\n  mutation DeleteActivity($input: DeleteActivityInput!) {\n    deleteActivity(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteActivityDocument,
    "\n  mutation RemoveActivityMember($input: RemoveActivityMemberInput!) {\n    removeActivityMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.RemoveActivityMemberDocument,
    "\n  mutation CreateActivityExpense($input: CreateActivityExpenseInput!) {\n    createActivityExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateActivityExpenseDocument,
    "\n  mutation DeleteActivityExpense($input: DeleteActivityExpenseInput!) {\n    deleteActivityExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteActivityExpenseDocument,
    "\n  query MyContexts {\n    myContexts {\n      ownerId\n      kind\n      name\n    }\n  }\n": types.MyContextsDocument,
    "\n  fragment GroupFields on GroupResponse {\n    id\n    ownerId\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n  }\n": types.GroupFieldsFragmentDoc,
    "\n  query Groups($search: String, $sort: NameSort) {\n    groups(search: $search, sort: $sort) {\n      ...GroupFields\n    }\n  }\n": types.GroupsDocument,
    "\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      ownerId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateGroupDocument,
    "\n  mutation RemoveGroupMember($input: RemoveGroupMemberInput!) {\n    removeGroupMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.RemoveGroupMemberDocument,
    "\n  mutation LeaveGroup($input: LeaveGroupInput!) {\n    leaveGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.LeaveGroupDocument,
    "\n  mutation DeleteGroup($input: DeleteGroupInput!) {\n    deleteGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteGroupDocument,
    "\n  query Me {\n    me {\n      id\n      email\n      displayName\n      firstName\n      lastName\n      profileCompleted\n    }\n  }\n": types.MeDocument,
    "\n  mutation CompleteProfile($input: CompleteProfileInput!) {\n    completeProfile(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CompleteProfileDocument,
    "\n  fragment ContactFields on ContactResponse {\n    id\n    userId\n    displayName\n    firstName\n    lastName\n    email\n    net\n  }\n": types.ContactFieldsFragmentDoc,
    "\n  query Contacts($search: String, $sort: NameSort) {\n    contacts(search: $search, sort: $sort) {\n      ...ContactFields\n    }\n  }\n": types.ContactsDocument,
    "\n  mutation RemoveContact($input: RemoveContactInput!) {\n    removeContact(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.RemoveContactDocument,
    "\n  fragment ContactExpenseFields on ContactExpenseResponse {\n    id\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n": types.ContactExpenseFieldsFragmentDoc,
    "\n  fragment ContactSettlementFields on ContactSettlementResponse {\n    id\n    fromUserId\n    toUserId\n    amount\n    date\n  }\n": types.ContactSettlementFieldsFragmentDoc,
    "\n  query ContactLedger($contactId: Int!) {\n    contactLedger(contactId: $contactId) {\n      contactId\n      userId\n      displayName\n      firstName\n      lastName\n      email\n      net\n      expenses {\n        ...ContactExpenseFields\n      }\n      settlements {\n        ...ContactSettlementFields\n      }\n    }\n  }\n": types.ContactLedgerDocument,
    "\n  mutation CreateContactExpense($input: CreateContactExpenseInput!) {\n    createContactExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.CreateContactExpenseDocument,
    "\n  mutation DeleteContactExpense($input: DeleteContactExpenseInput!) {\n    deleteContactExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteContactExpenseDocument,
    "\n  mutation RecordContactSettlement($input: RecordContactSettlementInput!) {\n    recordContactSettlement(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.RecordContactSettlementDocument,
    "\n  mutation DeleteContactSettlement($input: DeleteContactSettlementInput!) {\n    deleteContactSettlement(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeleteContactSettlementDocument,
    "\n  fragment InvitationFields on InvitationResponse {\n    id\n    type\n    direction\n    otherUserId\n    otherDisplayName\n    otherEmail\n    targetId\n    targetName\n    createdAt\n  }\n": types.InvitationFieldsFragmentDoc,
    "\n  query MyInvitations {\n    myInvitations {\n      ...InvitationFields\n    }\n  }\n": types.MyInvitationsDocument,
    "\n  mutation SendInvitation($input: SendInvitationInput!) {\n    sendInvitation(input: $input) {\n      invitationId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.SendInvitationDocument,
    "\n  mutation AcceptInvitation($input: AcceptInvitationInput!) {\n    acceptInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.AcceptInvitationDocument,
    "\n  mutation DeclineInvitation($input: DeclineInvitationInput!) {\n    declineInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n": types.DeclineInvitationDocument,
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
export function graphql(source: "\n  query Transactions($filter: TransactionFilterInput, $sort: TransactionSort) {\n    transactions(filter: $filter, sort: $sort) {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  query Transactions($filter: TransactionFilterInput, $sort: TransactionSort) {\n    transactions(filter: $filter, sort: $sort) {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TransactionsByPocket(\n    $pocketId: Int!\n    $search: String\n    $type: TransactionType\n    $sort: TransactionSort\n  ) {\n    transactionsByPocket(\n      pocketId: $pocketId\n      search: $search\n      type: $type\n      sort: $sort\n    ) {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  query TransactionsByPocket(\n    $pocketId: Int!\n    $search: String\n    $type: TransactionType\n    $sort: TransactionSort\n  ) {\n    transactionsByPocket(\n      pocketId: $pocketId\n      search: $search\n      type: $type\n      sort: $sort\n    ) {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n"): (typeof documents)["\n  query TransactionsBySavingGoal($savingGoalId: Int!) {\n    transactionsBySavingGoal(savingGoalId: $savingGoalId) {\n      ...TransactionFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query TransactionCategories($search: String, $sort: NameSort) {\n    transactionCategories(search: $search, sort: $sort) {\n      id\n      name\n    }\n  }\n"): (typeof documents)["\n  query TransactionCategories($search: String, $sort: NameSort) {\n    transactionCategories(search: $search, sort: $sort) {\n      id\n      name\n    }\n  }\n"];
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
export function graphql(source: "\n  query SavingGoals(\n    $search: String\n    $status: SavingGoalStatus\n    $sort: SavingGoalSort\n  ) {\n    savingGoals(search: $search, status: $status, sort: $sort) {\n      ...SavingGoalFields\n    }\n  }\n"): (typeof documents)["\n  query SavingGoals(\n    $search: String\n    $status: SavingGoalStatus\n    $sort: SavingGoalSort\n  ) {\n    savingGoals(search: $search, status: $status, sort: $sort) {\n      ...SavingGoalFields\n    }\n  }\n"];
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
export function graphql(source: "\n  query Pockets($search: String, $sort: PocketSort) {\n    pockets(search: $search, sort: $sort) {\n      ...PocketFields\n    }\n  }\n"): (typeof documents)["\n  query Pockets($search: String, $sort: PocketSort) {\n    pockets(search: $search, sort: $sort) {\n      ...PocketFields\n    }\n  }\n"];
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
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ActivityFields on ActivityResponse {\n    id\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n    balances {\n      userId\n      net\n    }\n    settlements {\n      fromUserId\n      toUserId\n      amount\n    }\n  }\n"): (typeof documents)["\n  fragment ActivityFields on ActivityResponse {\n    id\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n    balances {\n      userId\n      net\n    }\n    settlements {\n      fromUserId\n      toUserId\n      amount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ActivityExpenseFields on ActivityExpenseResponse {\n    id\n    activityId\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n"): (typeof documents)["\n  fragment ActivityExpenseFields on ActivityExpenseResponse {\n    id\n    activityId\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Activities($search: String, $sort: NameSort) {\n    activities(search: $search, sort: $sort) {\n      ...ActivityFields\n    }\n  }\n"): (typeof documents)["\n  query Activities($search: String, $sort: NameSort) {\n    activities(search: $search, sort: $sort) {\n      ...ActivityFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Activity($id: Int!) {\n    activity(id: $id) {\n      ...ActivityFields\n    }\n  }\n"): (typeof documents)["\n  query Activity($id: Int!) {\n    activity(id: $id) {\n      ...ActivityFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActivityExpenses($activityId: Int!) {\n    activityExpenses(activityId: $activityId) {\n      ...ActivityExpenseFields\n    }\n  }\n"): (typeof documents)["\n  query ActivityExpenses($activityId: Int!) {\n    activityExpenses(activityId: $activityId) {\n      ...ActivityExpenseFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateActivity($input: CreateActivityInput!) {\n    createActivity(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateActivity($input: CreateActivityInput!) {\n    createActivity(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteActivity($input: DeleteActivityInput!) {\n    deleteActivity(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteActivity($input: DeleteActivityInput!) {\n    deleteActivity(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveActivityMember($input: RemoveActivityMemberInput!) {\n    removeActivityMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveActivityMember($input: RemoveActivityMemberInput!) {\n    removeActivityMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateActivityExpense($input: CreateActivityExpenseInput!) {\n    createActivityExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateActivityExpense($input: CreateActivityExpenseInput!) {\n    createActivityExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteActivityExpense($input: DeleteActivityExpenseInput!) {\n    deleteActivityExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteActivityExpense($input: DeleteActivityExpenseInput!) {\n    deleteActivityExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyContexts {\n    myContexts {\n      ownerId\n      kind\n      name\n    }\n  }\n"): (typeof documents)["\n  query MyContexts {\n    myContexts {\n      ownerId\n      kind\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment GroupFields on GroupResponse {\n    id\n    ownerId\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n  }\n"): (typeof documents)["\n  fragment GroupFields on GroupResponse {\n    id\n    ownerId\n    name\n    description\n    createdByUserId\n    members {\n      userId\n      displayName\n      email\n      pending\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Groups($search: String, $sort: NameSort) {\n    groups(search: $search, sort: $sort) {\n      ...GroupFields\n    }\n  }\n"): (typeof documents)["\n  query Groups($search: String, $sort: NameSort) {\n    groups(search: $search, sort: $sort) {\n      ...GroupFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      ownerId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateGroup($input: CreateGroupInput!) {\n    createGroup(input: $input) {\n      ownerId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveGroupMember($input: RemoveGroupMemberInput!) {\n    removeGroupMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveGroupMember($input: RemoveGroupMemberInput!) {\n    removeGroupMember(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LeaveGroup($input: LeaveGroupInput!) {\n    leaveGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LeaveGroup($input: LeaveGroupInput!) {\n    leaveGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteGroup($input: DeleteGroupInput!) {\n    deleteGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteGroup($input: DeleteGroupInput!) {\n    deleteGroup(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      email\n      displayName\n      firstName\n      lastName\n      profileCompleted\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      email\n      displayName\n      firstName\n      lastName\n      profileCompleted\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CompleteProfile($input: CompleteProfileInput!) {\n    completeProfile(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CompleteProfile($input: CompleteProfileInput!) {\n    completeProfile(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ContactFields on ContactResponse {\n    id\n    userId\n    displayName\n    firstName\n    lastName\n    email\n    net\n  }\n"): (typeof documents)["\n  fragment ContactFields on ContactResponse {\n    id\n    userId\n    displayName\n    firstName\n    lastName\n    email\n    net\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Contacts($search: String, $sort: NameSort) {\n    contacts(search: $search, sort: $sort) {\n      ...ContactFields\n    }\n  }\n"): (typeof documents)["\n  query Contacts($search: String, $sort: NameSort) {\n    contacts(search: $search, sort: $sort) {\n      ...ContactFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RemoveContact($input: RemoveContactInput!) {\n    removeContact(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RemoveContact($input: RemoveContactInput!) {\n    removeContact(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ContactExpenseFields on ContactExpenseResponse {\n    id\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n"): (typeof documents)["\n  fragment ContactExpenseFields on ContactExpenseResponse {\n    id\n    description\n    date\n    amount\n    paidByUserId\n    splitType\n    splits {\n      userId\n      amount\n      percentage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ContactSettlementFields on ContactSettlementResponse {\n    id\n    fromUserId\n    toUserId\n    amount\n    date\n  }\n"): (typeof documents)["\n  fragment ContactSettlementFields on ContactSettlementResponse {\n    id\n    fromUserId\n    toUserId\n    amount\n    date\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ContactLedger($contactId: Int!) {\n    contactLedger(contactId: $contactId) {\n      contactId\n      userId\n      displayName\n      firstName\n      lastName\n      email\n      net\n      expenses {\n        ...ContactExpenseFields\n      }\n      settlements {\n        ...ContactSettlementFields\n      }\n    }\n  }\n"): (typeof documents)["\n  query ContactLedger($contactId: Int!) {\n    contactLedger(contactId: $contactId) {\n      contactId\n      userId\n      displayName\n      firstName\n      lastName\n      email\n      net\n      expenses {\n        ...ContactExpenseFields\n      }\n      settlements {\n        ...ContactSettlementFields\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateContactExpense($input: CreateContactExpenseInput!) {\n    createContactExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateContactExpense($input: CreateContactExpenseInput!) {\n    createContactExpense(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteContactExpense($input: DeleteContactExpenseInput!) {\n    deleteContactExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteContactExpense($input: DeleteContactExpenseInput!) {\n    deleteContactExpense(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RecordContactSettlement($input: RecordContactSettlementInput!) {\n    recordContactSettlement(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RecordContactSettlement($input: RecordContactSettlementInput!) {\n    recordContactSettlement(input: $input) {\n      id\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteContactSettlement($input: DeleteContactSettlementInput!) {\n    deleteContactSettlement(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteContactSettlement($input: DeleteContactSettlementInput!) {\n    deleteContactSettlement(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment InvitationFields on InvitationResponse {\n    id\n    type\n    direction\n    otherUserId\n    otherDisplayName\n    otherEmail\n    targetId\n    targetName\n    createdAt\n  }\n"): (typeof documents)["\n  fragment InvitationFields on InvitationResponse {\n    id\n    type\n    direction\n    otherUserId\n    otherDisplayName\n    otherEmail\n    targetId\n    targetName\n    createdAt\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query MyInvitations {\n    myInvitations {\n      ...InvitationFields\n    }\n  }\n"): (typeof documents)["\n  query MyInvitations {\n    myInvitations {\n      ...InvitationFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SendInvitation($input: SendInvitationInput!) {\n    sendInvitation(input: $input) {\n      invitationId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation SendInvitation($input: SendInvitationInput!) {\n    sendInvitation(input: $input) {\n      invitationId\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AcceptInvitation($input: AcceptInvitationInput!) {\n    acceptInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation AcceptInvitation($input: AcceptInvitationInput!) {\n    acceptInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeclineInvitation($input: DeclineInvitationInput!) {\n    declineInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation DeclineInvitation($input: DeclineInvitationInput!) {\n    declineInvitation(input: $input) {\n      boolean\n      errors {\n        ... on RequestError {\n          message\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;