import type { CombinedError } from "urql";

/** Human-readable message from a urql transport/GraphQL error. */
export function combinedErrorMessage(error: CombinedError): string {
  if (error.networkError) {
    return "Could not reach the server. Is the API running?";
  }
  return error.graphQLErrors[0]?.message ?? error.message ?? "Unexpected error.";
}

/**
 * Mutation payloads carry a typed `errors` array (the HotChocolate mutation
 * convention). Each entry is a `RequestError { message }`. Returns the first
 * message, or null when the mutation succeeded.
 */
export function payloadErrorMessage(
  errors: ReadonlyArray<{ message: string }> | null | undefined,
): string | null {
  if (!errors || errors.length === 0) return null;
  return errors[0].message;
}
