import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/shared/stores/authStore";
import { useGroupDetail } from "../hooks/useGroupDetail";
import { useDeleteGroup } from "../hooks/useGroups";
import { MemberList } from "../components/MemberList";
import { AddMemberDialog } from "../components/AddMemberDialog";
import { EditGroupDialog } from "../components/EditGroupDialog";
import { AddExpenseDialog } from "@/features/expenses/components/AddExpenseDialog";
import { ExpenseCard } from "@/features/expenses/components/ExpenseCard";
import { GroupBalanceSummary } from "@/features/expenses/components/GroupBalanceSummary";
import { useExpenses, useDeleteExpense } from "@/features/expenses/hooks/useExpenses";
import { SettleUpDialog } from "@/features/settlements/components/SettleUpDialog";
import { SettlementList } from "@/features/settlements/components/SettlementList";
import { ActivityFeed } from "@/features/activity/components/ActivityFeed";
import { useGroupRealtime } from "@/shared/hooks/useSignalR";

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [expensePage, setExpensePage] = useState(1);
  const { data: group, isLoading } = useGroupDetail(id!);
  const { data: expenseData, isLoading: expensesLoading } = useExpenses(id!, expensePage);
  const deleteGroup = useDeleteGroup();
  const deleteExpense = useDeleteExpense(id!);

  // Real-time updates via SignalR
  useGroupRealtime(id);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Group not found.</p>
      </div>
    );
  }

  const currentMember = group.members.find((m) => m.userId === user?.id);
  const isAdmin = currentMember?.role === "Admin";

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      deleteGroup.mutate(group.id, {
        onSuccess: () => navigate("/groups"),
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/groups")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{group.name}</h1>
            {group.description && (
              <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
            )}
          </div>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <EditGroupDialog group={group} />
            <Button
              variant="outline"
              size="icon"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              title="Delete group"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Balances + Debts + Settle Up */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Balances</h2>
        <SettleUpDialog groupId={group.id} />
      </div>
      <GroupBalanceSummary groupId={group.id} />

      {/* Expenses */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">
            Expenses ({expenseData?.totalCount ?? 0})
          </CardTitle>
          <AddExpenseDialog groupId={group.id} members={group.members} />
        </CardHeader>
        <CardContent>
          {expensesLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : !expenseData?.expenses.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No expenses yet. Add one to get started!
            </p>
          ) : (
            <>
              <div className="space-y-3">
                {expenseData.expenses.map((expense) => (
                  <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    currentUserRole={currentMember?.role ?? "Member"}
                    onDelete={(expenseId) => deleteExpense.mutate(expenseId)}
                  />
                ))}
              </div>
              {expenseData.totalCount > 20 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpensePage((p) => p - 1)}
                    disabled={expensePage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {expensePage} of {Math.ceil(expenseData.totalCount / 20)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpensePage((p) => p + 1)}
                    disabled={expensePage >= Math.ceil(expenseData.totalCount / 20)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Settlements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Settlement History</CardTitle>
        </CardHeader>
        <CardContent>
          <SettlementList groupId={group.id} />
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">
            Members ({group.members.length})
          </CardTitle>
          {isAdmin && <AddMemberDialog groupId={group.id} />}
        </CardHeader>
        <CardContent>
          <MemberList
            groupId={group.id}
            members={group.members}
            createdBy={group.createdBy}
            currentUserRole={currentMember?.role ?? "Member"}
          />
        </CardContent>
      </Card>

      {/* Activity */}
      <ActivityFeed groupId={group.id} />
    </div>
  );
}
