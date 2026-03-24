import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MonthlyBreakdown } from "@/shared/types/analytics.types";

export function SpendingChart({ data }: { data: MonthlyBreakdown[] }) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">Monthly Spending</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-8">No data yet</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Monthly Spending</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value: number) => `\u20B9${value.toLocaleString()}`} />
            <Bar dataKey="totalSpent" fill="#2DBAA0" name="Spent" radius={[4, 4, 0, 0]} />
            <Bar dataKey="totalPaid" fill="#1B3A5C" name="Paid" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
