import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePendingActions, useConfirmSettlement, useRejectSettlement } from "../hooks/useSettlements";
import { formatDistanceToNow } from "date-fns";

export function PendingActions() {
  const { data } = usePendingActions();
  const confirm = useConfirmSettlement();
  const reject = useRejectSettlement();

  if (!data?.pending.length) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Actions Required
          <span className="rounded-full bg-yellow-500 px-2 py-0.5 text-xs text-white">
            {data.count}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.pending.map((action) => (
          <div
            key={action.settlementId}
            className="flex items-center justify-between rounded-md border bg-background p-3"
          >
            <div>
              <p className="text-sm font-medium">
                {action.paidByName} says they paid you
              </p>
              <p className="text-xs text-muted-foreground">
                {action.groupName} &bull;{" "}
                {formatDistanceToNow(new Date(action.createdAt), { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold mr-2">
                {"\u20B9"}{action.amount.toLocaleString()}
              </span>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                onClick={() => confirm.mutate(action.settlementId)}
                disabled={confirm.isPending}
                title="Confirm"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => reject.mutate(action.settlementId)}
                disabled={reject.isPending}
                title="Reject"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
