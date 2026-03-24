import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/shared/stores/authStore";
import type { Expense } from "@/shared/types/expense.types";
import { formatDistanceToNow } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  currentUserRole: string;
  onDelete: (id: string) => void;
}

export function ExpenseCard({ expense, currentUserRole, onDelete }: ExpenseCardProps) {
  const { user } = useAuthStore();
  const isOwner = expense.paidBy === user?.id;
  const isAdmin = currentUserRole === "Admin";
  const canDelete = isOwner || isAdmin;

  const userSplit = expense.splits.find((s) => s.userId === user?.id);

  return (
    <div className="flex items-center justify-between rounded-md border p-4">
      <Link to={`/expenses/${expense.id}`} className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="font-medium truncate">{expense.description}</p>
            <p className="text-sm text-muted-foreground">
              {expense.paidByName} paid &bull;{" "}
              {formatDistanceToNow(new Date(expense.createdAt), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right ml-4 shrink-0">
            <p className="font-semibold">
              {expense.currency === "INR" ? "\u20B9" : expense.currency}
              {expense.amount.toLocaleString()}
            </p>
            {userSplit && (
              <p className="text-sm text-muted-foreground">
                You owe {expense.currency === "INR" ? "\u20B9" : ""}
                {userSplit.owedAmount.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{expense.category}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{expense.splitType}</span>
        </div>
      </Link>
      {canDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 text-muted-foreground hover:text-destructive shrink-0"
          onClick={(e) => {
            e.preventDefault();
            onDelete(expense.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
