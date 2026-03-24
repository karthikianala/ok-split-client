import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBalances, useSimplifiedDebts } from "../hooks/useExpenses";

export function GroupBalanceSummary({ groupId }: { groupId: string }) {
  const { data: balances, isLoading: balancesLoading } = useBalances(groupId);
  const { data: debts, isLoading: debtsLoading } = useSimplifiedDebts(groupId);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Balances */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Balances</CardTitle>
        </CardHeader>
        <CardContent>
          {balancesLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-8 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : !balances?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">No expenses yet</p>
          ) : (
            <div className="space-y-2">
              {balances.map((b) => (
                <div key={b.userId} className="flex items-center justify-between text-sm">
                  <span>{b.fullName}</span>
                  <span
                    className={
                      b.balance > 0
                        ? "font-medium text-green-600"
                        : b.balance < 0
                        ? "font-medium text-red-600"
                        : "text-muted-foreground"
                    }
                  >
                    {b.balance > 0 ? "+" : ""}
                    {"\u20B9"}
                    {Math.abs(b.balance).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Simplified Debts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Who owes whom</CardTitle>
        </CardHeader>
        <CardContent>
          {debtsLoading ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-8 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : !debts?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">All settled up!</p>
          ) : (
            <div className="space-y-3">
              {debts.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-red-600">{d.fromName}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-green-600">{d.toName}</span>
                  <span className="ml-auto font-semibold">
                    {"\u20B9"}{d.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
