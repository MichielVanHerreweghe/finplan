import { useCallback, useMemo } from "react";
import { useQuery } from "urql";

import { MyInvitationsQuery } from "@/graphql/operations";

/** All pending requests involving the current user, split by direction, for the Requests inbox. */
export function useRequests() {
  const [{ data, fetching, error }, reexecute] = useQuery({ query: MyInvitationsQuery });

  const refetch = useCallback(
    () => reexecute({ requestPolicy: "network-only" }),
    [reexecute],
  );

  const invitations = useMemo(() => data?.myInvitations ?? [], [data]);
  const incoming = useMemo(
    () => invitations.filter((invitation) => invitation.direction === "INCOMING"),
    [invitations],
  );
  const outgoing = useMemo(
    () => invitations.filter((invitation) => invitation.direction === "OUTGOING"),
    [invitations],
  );

  return { incoming, outgoing, incomingCount: incoming.length, fetching, error, refetch };
}
