import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "@/components/ui/toast";
import { settlementApi } from "../services/settlementApi";
import type { CreateSettlementRequest } from "@/shared/types/settlement.types";

export function useSettlements(groupId: string, page = 1) {
  return useQuery({
    queryKey: ["settlements", groupId, page],
    queryFn: () => settlementApi.list(groupId, undefined, page),
    enabled: !!groupId,
  });
}

export function useCreateSettlement(groupId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateSettlementRequest) => settlementApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["settlements", groupId] });
      queryClient.invalidateQueries({ queryKey: ["balances", groupId] });
      queryClient.invalidateQueries({ queryKey: ["debts", groupId] });
      toast({
        title: data.status === "Completed" ? "Settlement recorded!" : "Settlement pending",
        description:
          data.status === "Completed"
            ? "Payment confirmed"
            : "Waiting for confirmation",
        variant: data.status === "Completed" ? "success" : "info",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Settlement failed",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

export function usePendingActions() {
  return useQuery({
    queryKey: ["pending-actions"],
    queryFn: () => settlementApi.getPending(),
  });
}

export function useConfirmSettlement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => settlementApi.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-actions"] });
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["debts"] });
      toast({ title: "Settlement confirmed!", variant: "success" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to confirm",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

export function useRejectSettlement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => settlementApi.reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending-actions"] });
      queryClient.invalidateQueries({ queryKey: ["settlements"] });
      toast({ title: "Settlement rejected", variant: "info" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to reject",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
