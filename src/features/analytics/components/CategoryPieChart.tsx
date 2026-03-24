import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CategorySpend } from "@/shared/types/analytics.types";

const COLORS = ["#2DBAA0", "#1B3A5C", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6B7280"];

export function CategoryPieChart({ data }: { data: CategorySpend[] }) {
  if (!data.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-lg">Spending by Category</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-8">No data yet</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Spending by Category</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ category, percentage }) => `${category} ${percentage}%`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `\u20B9${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
