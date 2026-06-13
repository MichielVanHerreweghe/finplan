import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "urql";
import { toast } from "sonner";
import { Plus, Trash2, Users } from "lucide-react";

import { DeleteActivityMutation } from "@/graphql/operations";
import type { ActivityFieldsFragment } from "@/gql/graphql";
import { payloadErrorMessage, combinedErrorMessage } from "@/lib/graphql-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useActivities } from "./useActivities";
import { ActivityFormDialog } from "./ActivityFormDialog";

export function ActivitiesPage() {
  const { activities, fetching, error, refetch } = useActivities();
  const [, deleteActivity] = useMutation(DeleteActivityMutation);
  const navigate = useNavigate();

  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState<ActivityFieldsFragment | undefined>();
  const [deletePending, setDeletePending] = useState(false);

  async function confirmDelete() {
    if (!deleting) return;
    setDeletePending(true);
    const result = await deleteActivity({ input: { id: deleting.id } });
    setDeletePending(false);
    if (result.error) return toast.error(result.error.message);
    const msg = payloadErrorMessage(result.data?.deleteActivity.errors);
    if (msg) return toast.error(msg);
    toast.success("Activity deleted");
    setDeleting(undefined);
    refetch();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Activities</h1>
          <p className="text-sm text-muted-foreground">
            Share and split expenses with other people.
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus /> New activity
        </Button>
      </div>

      {fetching && (
        <p className="py-8 text-center text-muted-foreground">Loading…</p>
      )}
      {error && !fetching && (
        <p className="py-8 text-center text-destructive">
          {combinedErrorMessage(error)}
        </p>
      )}
      {!fetching && !error && activities.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No activities yet.</p>
      )}

      {!fetching && !error && activities.length > 0 && (
        <div className="space-y-4">
          {activities.map((activity) => (
            <Card key={activity.id}>
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="min-w-0 space-y-1">
                  <Link
                    to={`/activities/${activity.id}`}
                    className="font-semibold hover:underline"
                  >
                    {activity.name}
                  </Link>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                  <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    {activity.members.length}{" "}
                    {activity.members.length === 1 ? "member" : "members"}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleting(activity)}
                  aria-label="Delete activity"
                >
                  <Trash2 className="text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ActivityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        onSaved={(createdId) => {
          refetch();
          if (createdId != null) navigate(`/activities/${createdId}`);
        }}
      />

      <ConfirmDialog
        open={deleting !== undefined}
        onOpenChange={(open) => !open && setDeleting(undefined)}
        title="Delete activity?"
        description={`"${deleting?.name}" and its expenses will be permanently removed. Only the activity's creator can delete it.`}
        onConfirm={confirmDelete}
        pending={deletePending}
      />
    </div>
  );
}
