import { useState } from "react";
import { HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/shared/stores/authStore";
import { useSimplifiedDebts } from "@/features/expenses/hooks/useExpenses";
import { useCreateSettlement } from "../hooks/useSettlements";
import { settlementApi } from "../services/settlementApi";
import { loadRazorpayScript, openRazorpayCheckout } from "@/shared/lib/razorpay";
import { useToast } from "@/components/ui/toast";
import { useQueryClient } from "@tanstack/react-query";
import type { SimplifiedDebt } from "@/shared/types/expense.types";

export function SettleUpDialog({ groupId }: { groupId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<SimplifiedDebt | null>(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"Cash" | "Razorpay">("Cash");
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuthStore();
  const { data: debts } = useSimplifiedDebts(groupId);
  const createSettlement = useCreateSettlement(groupId);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSettle = async () => {
    if (!selectedDebt || !amount) return;

    if (method === "Cash") {
      createSettlement.mutate(
        {
          groupId,
          paidBy: selectedDebt.fromUserId,
          paidTo: selectedDebt.toUserId,
          amount: parseFloat(amount),
          paymentMethod: "Cash",
        },
        { onSuccess: () => { setIsOpen(false); resetState(); } }
      );
    } else {
      // Razorpay flow
      setIsProcessing(true);
      try {
        // 1. Create settlement (Pending)
        const settlement = await settlementApi.create({
          groupId,
          paidBy: selectedDebt.fromUserId,
          paidTo: selectedDebt.toUserId,
          amount: parseFloat(amount),
          paymentMethod: "Razorpay",
        });

        // 2. Create Razorpay order
        const order = await settlementApi.createOrder(settlement.id, parseFloat(amount));

        // 3. Load script and open checkout
        await loadRazorpayScript();
        openRazorpayCheckout({
          key: order.key,
          orderId: order.razorpayOrderId,
          amount: order.amount,
          currency: order.currency,
          onSuccess: async (response) => {
            try {
              await settlementApi.verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              toast({ title: "Payment successful!", variant: "success" });
              queryClient.invalidateQueries({ queryKey: ["settlements", groupId] });
              queryClient.invalidateQueries({ queryKey: ["balances", groupId] });
              queryClient.invalidateQueries({ queryKey: ["debts", groupId] });
              setIsOpen(false);
              resetState();
            } catch {
              toast({ title: "Payment verification failed", variant: "destructive" });
            }
            setIsProcessing(false);
          },
          onDismiss: () => setIsProcessing(false),
        });
      } catch {
        toast({ title: "Failed to initiate payment", variant: "destructive" });
        setIsProcessing(false);
      }
    }
  };

  const resetState = () => {
    setSelectedDebt(null);
    setAmount("");
    setMethod("Cash");
  };

  // Only show debts where current user is the debtor or creditor
  const relevantDebts = debts?.filter(
    (d) => d.fromUserId === user?.id || d.toUserId === user?.id
  );

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <HandCoins className="mr-2 h-4 w-4" />
        Settle Up
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Settle Up</h2>

        {!selectedDebt ? (
          <div className="space-y-3">
            {!relevantDebts?.length ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                You're all settled up!
              </p>
            ) : (
              relevantDebts.map((debt, i) => {
                const isDebtor = debt.fromUserId === user?.id;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDebt(debt);
                      setAmount(debt.amount.toString());
                    }}
                    className="w-full rounded-md border p-3 text-left hover:bg-accent transition-colors"
                  >
                    <p className="text-sm font-medium">
                      {isDebtor
                        ? `You owe ${debt.toName}`
                        : `${debt.fromName} owes you`}
                    </p>
                    <p className="text-lg font-semibold">{"\u20B9"}{debt.amount.toLocaleString()}</p>
                  </button>
                );
              })
            )}
            <Button variant="outline" className="w-full" onClick={() => { setIsOpen(false); resetState(); }}>
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {selectedDebt.fromUserId === user?.id
                ? `You owe ${selectedDebt.toName}`
                : `${selectedDebt.fromName} owes you`}
              {" — "}{"\u20B9"}{selectedDebt.amount.toLocaleString()}
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={selectedDebt.amount}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <div className="flex gap-2">
                {(["Cash", "Razorpay"] as const).map((m) => {
                  // Only debtor can use Razorpay
                  const disabled = m === "Razorpay" && selectedDebt.fromUserId !== user?.id;
                  return (
                    <label
                      key={m}
                      className={`flex-1 cursor-pointer rounded-md border p-2 text-center text-sm transition-colors ${
                        disabled ? "opacity-50 cursor-not-allowed" : ""
                      } ${
                        method === m && !disabled
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-input hover:bg-accent"
                      }`}
                    >
                      <input
                        type="radio"
                        value={m}
                        checked={method === m}
                        onChange={() => !disabled && setMethod(m)}
                        disabled={disabled}
                        className="sr-only"
                      />
                      {m}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setSelectedDebt(null)}>
                Back
              </Button>
              <Button
                onClick={handleSettle}
                disabled={!amount || parseFloat(amount) <= 0 || isProcessing || createSettlement.isPending}
              >
                {isProcessing || createSettlement.isPending
                  ? "Processing..."
                  : method === "Razorpay"
                  ? "Pay with Razorpay"
                  : "Record Payment"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
