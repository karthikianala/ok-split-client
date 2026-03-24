import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/shared/stores/authStore";
import { PendingActions } from "@/features/settlements/components/PendingActions";
import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { usePersonalSummary } from "@/features/analytics/hooks/useAnalytics";

export function DashboardPage() {
  const { user } = useAuthStore();
  const { data: summary } = usePersonalSummary();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.fullName ?? "User"}!</h1>

      {/* Personal Summary Cards */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Owed to you</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">
                {"\u20B9"}{summary.totalOwed.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">You owe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-red-600">
                {"\u20B9"}{summary.totalOwe.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {summary.netBalance >= 0 ? "+" : ""}{"\u20B9"}{Math.abs(summary.netBalance).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{summary.groupCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pending Actions */}
      <PendingActions />

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
}
