import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useToast } from "@/components/ui/toast";
import { groupApi } from "../services/groupApi";
import type { AddMemberRequest } from "@/shared/types/group.types";

export function useGroupDetail(id: string) {
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => groupApi.getDetail(id),
    enabled: !!id,
  });
}

export function useAddMember(groupId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: AddMemberRequest) => groupApi.addMember(groupId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({
        title: "Member added!",
        description: `${data.fullName} joined the group`,
        variant: "success",
      });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to add member",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}

export function useRemoveMember(groupId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userId: string) => groupApi.removeMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({ title: "Member removed", variant: "info" });
    },
    onError: (error: unknown) => {
      toast({
        title: "Failed to remove member",
        description: isAxiosError(error)
          ? error.response?.data?.message ?? "Something went wrong"
          : "Something went wrong",
        variant: "destructive",
      });
    },
  });
}
