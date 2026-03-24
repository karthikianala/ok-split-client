import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { expenseApi } from "../services/expenseApi";

export function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: expense, isLoading } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => expenseApi.getDetail(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-48 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Expense not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{expense.description}</h1>
          <p className="text-sm text-muted-foreground">
            Paid by {expense.paidByName} &bull; {new Date(expense.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-semibold">{"\u20B9"}{expense.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span>{expense.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Split Type</span>
              <span>{expense.splitType}</span>
            </div>
            {expense.notes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Notes</span>
                <span>{expense.notes}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Split Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expense.splits.map((split) => (
                <div key={split.userId} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{split.fullName}</p>
                    <p className="text-xs text-muted-foreground">{split.email}</p>
                  </div>
                  <span className="font-semibold">
                    {"\u20B9"}{split.owedAmount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
