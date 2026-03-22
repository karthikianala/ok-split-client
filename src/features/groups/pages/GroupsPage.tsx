import { useState } from "react";
import { useGroups } from "../hooks/useGroups";
import { GroupCard } from "../components/GroupCard";
import { CreateGroupDialog } from "../components/CreateGroupDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function GroupsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGroups(page);

  const totalPages = data ? Math.ceil(data.totalCount / data.limit) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {data?.totalCount ?? 0} groups
          </p>
        </div>
        <CreateGroupDialog />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-lg border bg-muted animate-pulse" />
          ))}
        </div>
      ) : data?.groups.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No groups yet. Create one to get started!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
