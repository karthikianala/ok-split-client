import { Shield, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/shared/stores/authStore";
import { useRemoveMember } from "../hooks/useGroupDetail";
import type { Member } from "@/shared/types/group.types";

interface MemberListProps {
  groupId: string;
  members: Member[];
  createdBy: string;
  currentUserRole: string;
}

export function MemberList({ groupId, members, createdBy, currentUserRole }: MemberListProps) {
  const { user } = useAuthStore();
  const removeMember = useRemoveMember(groupId);
  const isAdmin = currentUserRole === "Admin";

  return (
    <div className="space-y-2">
      {members.map((member) => {
        const isCreator = member.userId === createdBy;
        const isSelf = member.userId === user?.id;
        const canRemove = isAdmin && !isCreator && !isSelf;

        return (
          <div
            key={member.userId}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium">
                  {member.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{member.fullName}</p>
                  {member.role === "Admin" && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      <Shield className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                  {isCreator && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      Creator
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            {canRemove && (
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => removeMember.mutate(member.userId)}
                disabled={removeMember.isPending}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
