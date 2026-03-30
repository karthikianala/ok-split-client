import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/shared/stores/authStore";
import { useToast } from "@/components/ui/toast";
import { expenseApi } from "../services/expenseApi";
import { EXPENSE_CATEGORIES } from "@/shared/types/expense.types";

const editSchema = z.object({
  description: z.string().min(1, "Required").max(255),
  amount: z.coerce.number().positive("Must be positive"),
  category: z.string().min(1, "Required"),
  notes: z.string().optional().or(z.literal("")),
});

type EditFormData = z.infer<typeof editSchema>;

export function ExpenseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { data: expense, isLoading } = useQuery({
    queryKey: ["expense", id],
    queryFn: () => expenseApi.getDetail(id!),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    values: expense
      ? {
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          notes: expense.notes ?? "",
        }
      : undefined,
  });

  const updateExpense = useMutation({
    mutationFn: (data: EditFormData) =>
      expenseApi.update(id!, {
        groupId: expense!.groupId,
        description: data.description,
        amount: data.amount,
        category: data.category,
        splitType: expense!.splitType,
        notes: data.notes || undefined,
        splits: expense!.splits.map((s) => ({ userId: s.userId, amount: s.owedAmount })),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expense", id] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      toast({ title: "Expense updated!", variant: "success" });
      setIsEditing(false);
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to update",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
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
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const isOwner = expense.paidBy === user?.id;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
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
        {isOwner && !isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form
                onSubmit={handleSubmit((data) => updateExpense.mutate(data))}
                className="space-y-3"
              >
                <div className="space-y-1">
                  <label className="text-sm font-medium">Description</label>
                  <Input {...register("description")} />
                  {errors.description && (
                    <p className="text-xs text-destructive">{errors.description.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Amount</label>
                  <Input type="number" step="0.01" {...register("amount")} />
                  {errors.amount && (
                    <p className="text-xs text-destructive">{errors.amount.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    {...register("category")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Notes</label>
                  <Input {...register("notes")} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" size="sm" disabled={updateExpense.isPending}>
                    {updateExpense.isPending ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-sm">
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
