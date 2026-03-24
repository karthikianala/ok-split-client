import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "@/components/ui/toast";
import { expenseApi } from "../services/expenseApi";
import type { CreateExpenseRequest } from "@/shared/types/expense.types";

export function useExpenses(groupId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: ["expenses", groupId, page, limit],
    queryFn: () => expenseApi.list(groupId, { page, limit }),
    enabled: !!groupId,
  });
}

export function useCreateExpense(groupId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateExpenseRequest) => expenseApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", groupId] });
      queryClient.invalidateQueries({ queryKey: ["balances", groupId] });
      queryClient.invalidateQueries({ queryKey: ["debts", groupId] });
      toast({ title: "Expense added!", variant: "success" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to add expense",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteExpense(groupId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => expenseApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", groupId] });
      queryClient.invalidateQueries({ queryKey: ["balances", groupId] });
      queryClient.invalidateQueries({ queryKey: ["debts", groupId] });
      toast({ title: "Expense deleted", variant: "info" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to delete expense",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

export function useBalances(groupId: string) {
  return useQuery({
    queryKey: ["balances", groupId],
    queryFn: () => expenseApi.getBalances(groupId),
    enabled: !!groupId,
  });
}

export function useSimplifiedDebts(groupId: string) {
  return useQuery({
    queryKey: ["debts", groupId],
    queryFn: () => expenseApi.getSimplifiedDebts(groupId),
    enabled: !!groupId,
  });
}
