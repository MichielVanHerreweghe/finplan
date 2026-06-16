import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useMutation } from "urql";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, UserPlus, X } from "lucide-react";

import {
  DeleteGroupMutation,
  LeaveGroupMutation,
  RemoveGroupMemberMutation,
} from "@/graphql/operations";
import type { GroupFieldsFragment } from "@/gql/graphql";
import { combinedErrorMessage, payloadErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useGroups } from "./useGroups";
import { useOwnerContext } from "./OwnerContext";
import { CreateGroupDialog } from "./CreateGroupDialog";
import { AddMemberDialog } from "./AddMemberDialog";

type GroupMember = GroupFieldsFragment["members"][number];

// The destructive actions that require confirmation, with the data each needs.
type ConfirmAction =
  | { kind: "delete"; group: GroupFieldsFragment }
  | { kind: "leave"; group: GroupFieldsFragment }
  | { kind: "remove"; group: GroupFieldsFragment; member: GroupMember };

const memberLabel = (member: GroupMember) =>
  member.displayName ?? member.email ?? `User #${member.userId}`;

export function GroupsPage() {
  const { groups, fetching, error, refetch } = useGroups();
  const { activeOwnerId, setActiveOwner, refetchContexts } = useOwnerContext();
  const auth = useAuth();
  const currentEmail = auth.user?.profile?.email;

  const [, removeMember] = useMutation(RemoveGroupMemberMutation);
  const [, leaveGroup] = useMutation(LeaveGroupMutation);
  const [, deleteGroup] = useMutation(DeleteGroupMutation);

  const [createOpen, setCreateOpen] = useState(false);
  const [addMemberFor, setAddMemberFor] = useState<number | undefined>();
  const [confirm, setConfirm] = useState<ConfirmAction | undefined>();
  const [pending, setPending] = useState(false);

  function refetchAll() {
    refetch();
    refetchContexts();
  }

  // Runs the confirmed mutation; returns an error message, or null on success.
  async function execute(action: ConfirmAction): Promise<string | null> {
    if (action.kind === "delete") {
      const result = await deleteGroup({ input: { groupId: action.group.id } });
      if (result.error) return result.error.message;
      return payloadErrorMessage(result.data?.deleteGroup.errors);
    }
    if (action.kind === "leave") {
      const result = await leaveGroup({ input: { groupId: action.group.id } });
      if (result.error) return result.error.message;
      return payloadErrorMessage(result.data?.leaveGroup.errors);
    }
    const result = await removeMember({
      input: { groupId: action.group.id, userId: action.member.userId },
    });
    if (result.error) return result.error.message;
    return payloadErrorMessage(result.data?.removeGroupMember.errors);
  }

  async function onConfirm() {
    if (!confirm) return;
    const action = confirm;
    setPending(true);
    const errorMessage = await execute(action);
    setPending(false);
    if (errorMessage) return toast.error(errorMessage);

    toast.success(
      action.kind === "delete"
        ? "Group deleted"
        : action.kind === "leave"
          ? "Left group"
          : "Member removed",
    );
    setConfirm(undefined);

    // Leaving/deleting the group we're currently acting in drops us back to Personal.
    if (
      (action.kind === "delete" || action.kind === "leave") &&
      activeOwnerId === action.group.ownerId
    ) {
      setActiveOwner(null);
    }
    if (action.kind === "remove") refetch();
    else refetchAll();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
          <p className="text-sm text-muted-foreground">
            Shared accounts. Switch into a group from the context picker to manage its finances.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus /> New group
        </Button>
      </div>

      {fetching && <p className="py-8 text-center text-muted-foreground">Loading…</p>}
      {error && !fetching && (
        <p className="py-8 text-center text-destructive">{combinedErrorMessage(error)}</p>
      )}
      {!fetching && !error && groups.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No groups yet.</p>
      )}

      {!fetching && !error && groups.length > 0 && (
        <div className="space-y-4">
          {groups.map((group) => {
            const me = group.members.find((member) => member.email && member.email === currentEmail);
            const isCreator = me?.userId === group.createdByUserId;
            return (
              <Card key={group.id}>
                <CardContent className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">
                        {group.name}
                        {activeOwnerId === group.ownerId && (
                          <span className="ml-2 text-xs font-normal text-primary">active</span>
                        )}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {activeOwnerId !== group.ownerId && (
                        <Button variant="outline" size="sm" onClick={() => setActiveOwner(group.ownerId)}>
                          Switch to
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => setAddMemberFor(group.id)}>
                        <UserPlus className="size-4" /> Add
                      </Button>
                    </div>
                  </div>

                  <ul className="space-y-1 border-t pt-3">
                    {group.members.map((member) => (
                      <li
                        key={member.userId}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="min-w-0 truncate">
                          {memberLabel(member)}
                          {member.userId === group.createdByUserId && (
                            <span className="ml-2 text-xs text-muted-foreground">creator</span>
                          )}
                        </span>
                        {isCreator && member.userId !== group.createdByUserId && (
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => setConfirm({ kind: "remove", group, member })}
                            aria-label="Remove member"
                          >
                            <X className="size-4" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>

                  <div className="flex justify-end border-t pt-3">
                    {isCreator ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => setConfirm({ kind: "delete", group })}
                      >
                        <Trash2 className="size-4" /> Delete group
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirm({ kind: "leave", group })}
                      >
                        <LogOut className="size-4" /> Leave
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreateGroupDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={(ownerId) => {
          refetchAll();
          setActiveOwner(ownerId);
        }}
      />

      <AddMemberDialog
        open={addMemberFor !== undefined}
        onOpenChange={(open) => !open && setAddMemberFor(undefined)}
        groupId={addMemberFor ?? 0}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={confirm !== undefined}
        onOpenChange={(open) => !open && setConfirm(undefined)}
        title={
          confirm?.kind === "delete"
            ? "Delete group?"
            : confirm?.kind === "remove"
              ? "Remove member?"
              : "Leave group?"
        }
        description={
          confirm?.kind === "delete"
            ? `"${confirm.group.name}" and its shared finances will be permanently removed.`
            : confirm?.kind === "remove"
              ? `${memberLabel(confirm.member)} will be removed from "${confirm.group.name}" and will lose access to its shared finances.`
              : `You'll lose access to "${confirm?.group.name}" and its shared finances.`
        }
        onConfirm={onConfirm}
        pending={pending}
      />
    </div>
  );
}
