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
  query Transactions {
    transactions {
      ...TransactionFields
    }
  }
`);

export const TransactionsByPocketQuery = graphql(`
  query TransactionsByPocket($pocketId: Int!) {
    transactionsByPocket(pocketId: $pocketId) {
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
  query TransactionCategories {
    transactionCategories {
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
  query SavingGoals {
    savingGoals {
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
  query Pockets {
    pockets {
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
  query Groups {
    groups {
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
