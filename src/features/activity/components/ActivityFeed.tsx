import { useActivity } from "@/features/analytics/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const actionIcons: Record<string, string> = {
  expense_added: "+",
  expense_deleted: "-",
  member_joined: ">>",
  member_left: "<<",
  settlement_created: "$",
  settlement_completed: "$$",
};

export function ActivityFeed({ groupId }: { groupId?: string }) {
  const { data, isLoading } = useActivity(groupId);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : !data?.activities.length ? (
          <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {data.activities.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-mono">
                  {actionIcons[a.action] ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{a.userName}</span>{" "}
                    <span className="text-muted-foreground">{a.description}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.groupName && <>{a.groupName} &bull; </>}
                    {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
