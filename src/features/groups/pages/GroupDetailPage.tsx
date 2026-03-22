import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/shared/stores/authStore";
import { useGroupDetail } from "../hooks/useGroupDetail";
import { useDeleteGroup } from "../hooks/useGroups";
import { MemberList } from "../components/MemberList";
import { AddMemberDialog } from "../components/AddMemberDialog";

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: group, isLoading } = useGroupDetail(id!);
  const deleteGroup = useDeleteGroup();

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Group not found.</p>
      </div>
    );
  }

  const currentMember = group.members.find((m) => m.userId === user?.id);
  const isAdmin = currentMember?.role === "Admin";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      deleteGroup.mutate(group.id, {
        onSuccess: () => navigate("/groups"),
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/groups")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            {group.description && (
              <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
            )}
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              title="Delete group"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Members */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">
            Members ({group.members.length})
          </CardTitle>
          {isAdmin && <AddMemberDialog groupId={group.id} />}
        </CardHeader>
        <CardContent>
          <MemberList
            groupId={group.id}
            members={group.members}
            createdBy={group.createdBy}
            currentUserRole={currentMember?.role ?? "Member"}
          />
        </CardContent>
      </Card>

      {/* Expenses placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            No expenses yet. They'll appear here in Module 3.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
