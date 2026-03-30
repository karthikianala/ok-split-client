import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateExpense } from "../hooks/useExpenses";
import { ReceiptUpload } from "./ReceiptUpload";
import { EXPENSE_CATEGORIES } from "@/shared/types/expense.types";
import type { Member } from "@/shared/types/group.types";

const schema = z.object({
  description: z.string().min(1, "Required").max(255),
  amount: z.coerce.number().positive("Must be positive"),
  category: z.string().min(1, "Required"),
  splitType: z.enum(["Equal", "Exact", "Percentage"]),
  notes: z.string().optional().or(z.literal("")),
  splits: z.array(
    z.object({
      userId: z.string(),
      fullName: z.string(),
      selected: z.boolean(),
      amount: z.coerce.number().optional(),
      percentage: z.coerce.number().optional(),
    })
  ),
});

type FormData = z.infer<typeof schema>;

interface AddExpenseDialogProps {
  groupId: string;
  members: Member[];
}

export function AddExpenseDialog({ groupId, members }: AddExpenseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | undefined>();
  const createExpense = useCreateExpense(groupId);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      splitType: "Equal",
      splits: members.map((m) => ({
        userId: m.userId,
        fullName: m.fullName,
        selected: true,
        amount: 0,
        percentage: 0,
      })),
    },
  });

  const { fields } = useFieldArray({ control, name: "splits" });
  const splitType = watch("splitType");
  const totalAmount = watch("amount") || 0;

  const onSubmit = (data: FormData) => {
    const selectedSplits = data.splits.filter((s) => s.selected);
    if (selectedSplits.length === 0) return;

    createExpense.mutate(
      {
        groupId,
        description: data.description,
        amount: data.amount,
        category: data.category,
        splitType: data.splitType,
        notes: data.notes || undefined,
        splits: selectedSplits.map((s) => ({
          userId: s.userId,
          amount: data.splitType === "Exact" ? s.amount : undefined,
          percentage: data.splitType === "Percentage" ? s.percentage : undefined,
        })),
      },
      {
        onSuccess: () => {
          reset();
          setReceiptUrl(undefined);
          setIsOpen(false);
        },
      }
    );
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Expense
      </Button>
    );
  }

  const selectedCount = watch("splits")?.filter((s) => s.selected).length ?? 0;
  const equalShare = selectedCount > 0 ? (totalAmount / selectedCount).toFixed(2) : "0.00";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border bg-background p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Add Expense</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input placeholder="e.g. Dinner at restaurant" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount (INR)</label>
            <Input type="number" step="0.01" placeholder="0.00" {...register("amount")} />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              {...register("category")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>

          {/* Split Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Split Type</label>
            <div className="flex gap-2">
              {(["Equal", "Exact", "Percentage"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex-1 cursor-pointer rounded-md border p-2 text-center text-sm transition-colors ${
                    splitType === type
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-input hover:bg-accent"
                  }`}
                >
                  <input type="radio" value={type} {...register("splitType")} className="sr-only" />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Split Participants */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Split among ({selectedCount} selected)
              {splitType === "Equal" && totalAmount > 0 && (
                <span className="font-normal text-muted-foreground"> — {"\u20B9"}{equalShare} each</span>
              )}
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-3 rounded-md border p-2">
                  <input type="checkbox" {...register(`splits.${index}.selected`)} className="h-4 w-4" />
                  <span className="flex-1 text-sm">{field.fullName}</span>
                  {splitType === "Exact" && (
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-24 h-8 text-sm"
                      {...register(`splits.${index}.amount`)}
                    />
                  )}
                  {splitType === "Percentage" && (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        className="w-20 h-8 text-sm"
                        {...register(`splits.${index}.percentage`)}
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Receipt <span className="text-muted-foreground">(optional)</span></label>
            <ReceiptUpload value={receiptUrl} onChange={setReceiptUrl} />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes <span className="text-muted-foreground">(optional)</span></label>
            <Input placeholder="Any additional details..." {...register("notes")} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={() => { reset(); setIsOpen(false); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createExpense.isPending}>
              {createExpense.isPending ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
