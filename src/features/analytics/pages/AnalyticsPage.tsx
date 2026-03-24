import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMonthlyBreakdown, useCategorySpend, usePersonalSummary } from "../hooks/useAnalytics";
import { useGroups } from "@/features/groups/hooks/useGroups";
import { SpendingChart } from "../components/SpendingChart";
import { CategoryPieChart } from "../components/CategoryPieChart";

export function AnalyticsPage() {
  const [groupId, setGroupId] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: groupsData } = useGroups(1, 100);
  const { data: personal } = usePersonalSummary();
  const { data: monthly } = useMonthlyBreakdown(
    groupId || undefined,
    startDate || undefined,
    endDate || undefined
  );
  const { data: category } = useCategorySpend(
    groupId || undefined,
    startDate || undefined,
    endDate || undefined
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Personal Summary */}
      {personal && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Owed to you</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-green-600">{"\u20B9"}{personal.totalOwed.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">You owe</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold text-red-600">{"\u20B9"}{personal.totalOwe.toLocaleString()}</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Net Balance</CardTitle></CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${personal.netBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {personal.netBalance >= 0 ? "+" : ""}{"\u20B9"}{Math.abs(personal.netBalance).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Groups / Expenses</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{personal.groupCount} / {personal.expenseCount}</p></CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All Groups</option>
          {groupsData?.groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-40"
          placeholder="Start date"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-40"
          placeholder="End date"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingChart data={monthly ?? []} />
        <CategoryPieChart data={category ?? []} />
      </div>
    </div>
  );
}
