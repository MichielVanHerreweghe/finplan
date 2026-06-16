import { graphql } from "@/gql";

// All operations are authored here as typed documents. `npm run codegen`
// introspects the live API and generates the matching types into src/gql.

export const TransactionFields = graphql(`
  fragment TransactionFields on TransactionResponse {
    id
    name
    date
    amount
    type
    categoryId
    fromPocketId
    toPocketId
    savingGoalId
    category {
      id
      name
    }
  }
`);

export const TransactionsQuery = graphql(`
  query Transactions($filter: TransactionFilterInput, $sort: TransactionSort) {
    transactions(filter: $filter, sort: $sort) {
      ...TransactionFields
    }
  }
`);

export const TransactionsByPocketQuery = graphql(`
  query TransactionsByPocket(
    $pocketId: Int!
    $search: String
    $type: TransactionType
    $sort: TransactionSort
  ) {
    transactionsByPocket(
      pocketId: $pocketId
      search: $search
      type: $type
      sort: $sort
    ) {
      ...TransactionFields
    }
  }
`);

export const TransactionsBySavingGoalQuery = graphql(`
  query TransactionsBySavingGoal($savingGoalId: Int!) {
    transactionsBySavingGoal(savingGoalId: $savingGoalId) {
      ...TransactionFields
    }
  }
`);

export const CategoriesQuery = graphql(`
  query TransactionCategories($search: String, $sort: NameSort) {
    transactionCategories(search: $search, sort: $sort) {
      id
      name
    }
  }
`);

export const CreateTransactionMutation = graphql(`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      id
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const UpdateTransactionMutation = graphql(`
  mutation UpdateTransaction($input: UpdateTransactionInput!) {
    updateTransaction(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const DeleteTransactionMutation = graphql(`
  mutation DeleteTransaction($input: DeleteTransactionInput!) {
    deleteTransaction(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const CreateCategoryMutation = graphql(`
  mutation CreateTransactionCategory($input: CreateTransactionCategoryInput!) {
    createTransactionCategory(input: $input) {
      id
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const UpdateCategoryMutation = graphql(`
  mutation UpdateTransactionCategory($input: UpdateTransactionCategoryInput!) {
    updateTransactionCategory(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const DeleteCategoryMutation = graphql(`
  mutation DeleteTransactionCategory($input: DeleteTransactionCategoryInput!) {
    deleteTransactionCategory(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const SavingGoalFields = graphql(`
  fragment SavingGoalFields on SavingGoalResponse {
    id
    name
    description
    targetAmount
    deadline
    pocketId
    savedAmount
    remainingAmount
    isCompleted
    requiredMonthly
    requiredWeekly
    isOverdue
  }
`);

export const SavingGoalsQuery = graphql(`
  query SavingGoals(
    $search: String
    $status: SavingGoalStatus
    $sort: SavingGoalSort
  ) {
    savingGoals(search: $search, status: $status, sort: $sort) {
      ...SavingGoalFields
    }
  }
`);

export const CreateSavingGoalMutation = graphql(`
  mutation CreateSavingGoal($input: CreateSavingGoalInput!) {
    createSavingGoal(input: $input) {
      id
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const UpdateSavingGoalMutation = graphql(`
  mutation UpdateSavingGoal($input: UpdateSavingGoalInput!) {
    updateSavingGoal(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const DeleteSavingGoalMutation = graphql(`
  mutation DeleteSavingGoal($input: DeleteSavingGoalInput!) {
    deleteSavingGoal(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const PocketFields = graphql(`
  fragment PocketFields on PocketResponse {
    id
    name
    description
    parentPocketId
    startingAmount
    balance
  }
`);

export const PocketsQuery = graphql(`
  query Pockets($search: String, $sort: PocketSort) {
    pockets(search: $search, sort: $sort) {
      ...PocketFields
    }
  }
`);

export const CreatePocketMutation = graphql(`
  mutation CreatePocket($input: CreatePocketInput!) {
    createPocket(input: $input) {
      id
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const UpdatePocketMutation = graphql(`
  mutation UpdatePocket($input: UpdatePocketInput!) {
    updatePocket(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const DeletePocketMutation = graphql(`
  mutation DeletePocket($input: DeletePocketInput!) {
    deletePocket(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const ActivityFields = graphql(`
  fragment ActivityFields on ActivityResponse {
    id
    name
    description
    createdByUserId
    members {
      userId
      displayName
      email
    }
    balances {
      userId
      net
    }
    settlements {
      fromUserId
      toUserId
      amount
    }
  }
`);

export const ActivityExpenseFields = graphql(`
  fragment ActivityExpenseFields on ActivityExpenseResponse {
    id
    activityId
    description
    date
    amount
    paidByUserId
    splitType
    splits {
      userId
      amount
      percentage
    }
  }
`);

export const ActivitiesQuery = graphql(`
  query Activities($search: String, $sort: NameSort) {
    activities(search: $search, sort: $sort) {
      ...ActivityFields
    }
  }
`);

export const ActivityQuery = graphql(`
  query Activity($id: Int!) {
    activity(id: $id) {
      ...ActivityFields
    }
  }
`);

export const ActivityExpensesQuery = graphql(`
  query ActivityExpenses($activityId: Int!) {
    activityExpenses(activityId: $activityId) {
      ...ActivityExpenseFields
    }
  }
`);

export const CreateActivityMutation = graphql(`
  mutation CreateActivity($input: CreateActivityInput!) {
    createActivity(input: $input) {
      id
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const DeleteActivityMutation = graphql(`
  mutation DeleteActivity($input: DeleteActivityInput!) {
    deleteActivity(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const AddActivityMemberMutation = graphql(`
  mutation AddActivityMember($input: AddActivityMemberInput!) {
    addActivityMember(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const RemoveActivityMemberMutation = graphql(`
  mutation RemoveActivityMember($input: RemoveActivityMemberInput!) {
    removeActivityMember(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const CreateActivityExpenseMutation = graphql(`
  mutation CreateActivityExpense($input: CreateActivityExpenseInput!) {
    createActivityExpense(input: $input) {
      id
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const DeleteActivityExpenseMutation = graphql(`
  mutation DeleteActivityExpense($input: DeleteActivityExpenseInput!) {
    deleteActivityExpense(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const MyContextsQuery = graphql(`
  query MyContexts {
    myContexts {
      ownerId
      kind
      name
    }
  }
`);

export const GroupFields = graphql(`
  fragment GroupFields on GroupResponse {
    id
    ownerId
    name
    description
    createdByUserId
    members {
      userId
      displayName
      email
    }
  }
`);

export const GroupsQuery = graphql(`
  query Groups($search: String, $sort: NameSort) {
    groups(search: $search, sort: $sort) {
      ...GroupFields
    }
  }
`);

export const CreateGroupMutation = graphql(`
  mutation CreateGroup($input: CreateGroupInput!) {
    createGroup(input: $input) {
      ownerId
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const AddGroupMemberMutation = graphql(`
  mutation AddGroupMember($input: AddGroupMemberInput!) {
    addGroupMember(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const RemoveGroupMemberMutation = graphql(`
  mutation RemoveGroupMember($input: RemoveGroupMemberInput!) {
    removeGroupMember(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const LeaveGroupMutation = graphql(`
  mutation LeaveGroup($input: LeaveGroupInput!) {
    leaveGroup(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const DeleteGroupMutation = graphql(`
  mutation DeleteGroup($input: DeleteGroupInput!) {
    deleteGroup(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);
