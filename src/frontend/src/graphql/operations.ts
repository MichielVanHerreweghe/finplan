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
    savedAmount
    remainingAmount
    isCompleted
    requiredMonthly
    requiredWeekly
    isOverdue
    contributions {
      id
      amount
      date
    }
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

export const AddContributionMutation = graphql(`
  mutation AddContribution($input: AddContributionInput!) {
    addContribution(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);

export const RemoveContributionMutation = graphql(`
  mutation RemoveContribution($input: RemoveContributionInput!) {
    removeContribution(input: $input) {
      boolean
      errors {
        ... on RequestError {
          message
        }
      }
    }
  }
`);
