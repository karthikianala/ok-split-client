import { CheckCircle, Clock, XCircle, CreditCard, Banknote } from "lucide-react";
import { useSettlements } from "../hooks/useSettlements";
import { formatDistanceToNow } from "date-fns";

const statusIcons: Record<string, typeof CheckCircle> = {
  Completed: CheckCircle,
  Pending: Clock,
  Rejected: XCircle,
  Failed: XCircle,
};

const statusColors: Record<string, string> = {
  Completed: "text-green-600",
  Pending: "text-yellow-600",
  Rejected: "text-red-600",
  Failed: "text-red-600",
};

export function SettlementList({ groupId }: { groupId: string }) {
  const { data, isLoading } = useSettlements(groupId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!data?.settlements.length) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No settlements yet
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {data.settlements.map((s) => {
        const StatusIcon = statusIcons[s.status] ?? Clock;
        const MethodIcon = s.paymentMethod === "Razorpay" ? CreditCard : Banknote;

        return (
          <div key={s.id} className="flex items-center justify-between rounded-md border p-3">
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-5 w-5 ${statusColors[s.status]}`} />
              <div>
                <p className="text-sm font-medium">
                  {s.paidByName} paid {s.paidToName}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MethodIcon className="h-3 w-3" />
                  <span>{s.paymentMethod}</span>
                  <span>&bull;</span>
                  <span>{formatDistanceToNow(new Date(s.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{"\u20B9"}{s.amount.toLocaleString()}</p>
              <p className={`text-xs ${statusColors[s.status]}`}>{s.status}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
