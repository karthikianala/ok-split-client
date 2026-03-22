import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "@/components/ui/toast";
import { groupApi } from "../services/groupApi";
import type { CreateGroupRequest } from "@/shared/types/group.types";

export function useGroups(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["groups", page, limit],
    queryFn: () => groupApi.list(page, limit),
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateGroupRequest) => groupApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({
        title: "Group created!",
        description: `"${data.name}" is ready`,
        variant: "success",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to create group",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => groupApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({ title: "Group deleted", variant: "info" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to delete group",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
