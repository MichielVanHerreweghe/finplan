import { useState } from "react";
import { useMutation } from "urql";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

import { AcceptInvitationMutation, DeclineInvitationMutation } from "@/graphql/operations";
import type { InvitationFieldsFragment } from "@/gql/graphql";
import { combinedErrorMessage, payloadErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useRequests } from "./useRequests";

const otherLabel = (invitation: InvitationFieldsFragment) =>
  invitation.otherDisplayName ?? invitation.otherEmail ?? `User #${invitation.otherUserId}`;

// What the request is for, from the recipient's point of view.
function describe(invitation: InvitationFieldsFragment): string {
  const who = otherLabel(invitation);
  switch (invitation.type) {
    case "CONTACT":
      return `${who} wants to connect`;
    case "GROUP_MEMBER":
      return `${who} invited you to the group "${invitation.targetName ?? ""}"`;
    case "ACTIVITY_MEMBER":
      return `${who} invited you to the activity "${invitation.targetName ?? ""}"`;
    default:
      return who;
  }
}

function describeOutgoing(invitation: InvitationFieldsFragment): string {
  const who = otherLabel(invitation);
  switch (invitation.type) {
    case "CONTACT":
      return `Contact request to ${who}`;
    case "GROUP_MEMBER":
      return `Invited ${who} to "${invitation.targetName ?? ""}"`;
    case "ACTIVITY_MEMBER":
      return `Invited ${who} to "${invitation.targetName ?? ""}"`;
    default:
      return who;
  }
}

export function RequestsPage() {
  const { incoming, outgoing, fetching, error, refetch } = useRequests();

  const [, accept] = useMutation(AcceptInvitationMutation);
  const [, decline] = useMutation(DeclineInvitationMutation);
  const [pendingId, setPendingId] = useState<number | undefined>();

  async function respond(id: number, action: "accept" | "decline") {
    setPendingId(id);
    let errorMessage: string | null = null;
    if (action === "accept") {
      const result = await accept({ input: { invitationId: id } });
      errorMessage = result.error?.message ?? payloadErrorMessage(result.data?.acceptInvitation.errors);
    } else {
      const result = await decline({ input: { invitationId: id } });
      errorMessage = result.error?.message ?? payloadErrorMessage(result.data?.declineInvitation.errors);
    }
    setPendingId(undefined);
    if (errorMessage) return toast.error(errorMessage);
    toast.success(action === "accept" ? "Request accepted" : "Request declined");
    refetch();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Requests"
        description="Contact, group and activity invitations waiting on you."
      />

      {fetching && <p className="py-8 text-center text-muted-foreground">Loading…</p>}
      {error && !fetching && (
        <p className="py-8 text-center text-destructive">{combinedErrorMessage(error)}</p>
      )}

      {!fetching && !error && (
        <>
          <section className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">Incoming</h2>
            {incoming.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">No incoming requests.</p>
            ) : (
              <Card>
                <CardContent className="p-2">
                  <ul className="divide-y">
                    {incoming.map((invitation) => (
                      <li
                        key={invitation.id}
                        className="flex items-center justify-between gap-3 px-3 py-3 text-sm"
                      >
                        <span className="min-w-0 flex-1">{describe(invitation)}</span>
                        <div className="flex shrink-0 gap-2">
                          <Button
                            size="sm"
                            disabled={pendingId === invitation.id}
                            onClick={() => respond(invitation.id, "accept")}
                          >
                            <Check className="size-4" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pendingId === invitation.id}
                            onClick={() => respond(invitation.id, "decline")}
                          >
                            <X className="size-4" /> Decline
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">Sent</h2>
            {outgoing.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">No sent requests.</p>
            ) : (
              <Card>
                <CardContent className="p-2">
                  <ul className="divide-y">
                    {outgoing.map((invitation) => (
                      <li
                        key={invitation.id}
                        className="flex items-center justify-between gap-3 px-3 py-3 text-sm"
                      >
                        <span className="min-w-0 flex-1">{describeOutgoing(invitation)}</span>
                        <span className="shrink-0 text-xs font-medium text-muted-foreground">
                          pending
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </section>
        </>
      )}
    </div>
  );
}
