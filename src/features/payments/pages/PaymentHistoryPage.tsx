import { useQuery } from "@tanstack/react-query";
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/shared/lib/axios";
import { formatDistanceToNow } from "date-fns";

interface Payment {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: string;
  paidTo: string;
  createdAt: string;
}

export function PaymentHistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["payment-history"],
    queryFn: () =>
      api
        .get<{ payments: Payment[]; totalCount: number }>("/payments/history")
        .then((r) => r.data),
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Payment History</h1>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Razorpay Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : !data?.payments.length ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No Razorpay payments yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-md border p-3">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Paid to {p.paidTo}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.razorpayPaymentId ?? p.razorpayOrderId} &bull;{" "}
                        {formatDistanceToNow(new Date(p.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {"\u20B9"}{p.amount.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs ${
                        p.status === "Captured"
                          ? "text-green-600"
                          : p.status === "Failed"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {p.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
