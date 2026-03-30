import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  getConnection,
  startConnection,
  joinGroup,
  leaveGroup,
} from "@/shared/lib/signalr";

export function useGroupRealtime(groupId: string | undefined) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!groupId || !isAuthenticated) return;

    let mounted = true;

    const setup = async () => {
      try {
        await startConnection();
        if (!mounted) return;
        await joinGroup(groupId);

        const conn = getConnection();

        conn.on("ExpenseAdded", () => {
          queryClient.invalidateQueries({ queryKey: ["expenses", groupId] });
          queryClient.invalidateQueries({ queryKey: ["balances", groupId] });
          queryClient.invalidateQueries({ queryKey: ["debts", groupId] });
          queryClient.invalidateQueries({ queryKey: ["activity", groupId] });
          toast({ title: "New expense added", variant: "info" });
        });

        conn.on("ExpenseDeleted", () => {
          queryClient.invalidateQueries({ queryKey: ["expenses", groupId] });
          queryClient.invalidateQueries({ queryKey: ["balances", groupId] });
          queryClient.invalidateQueries({ queryKey: ["debts", groupId] });
          queryClient.invalidateQueries({ queryKey: ["activity", groupId] });
        });

        conn.on("SettlementMade", () => {
          queryClient.invalidateQueries({ queryKey: ["settlements", groupId] });
          queryClient.invalidateQueries({ queryKey: ["balances", groupId] });
          queryClient.invalidateQueries({ queryKey: ["debts", groupId] });
          queryClient.invalidateQueries({ queryKey: ["activity", groupId] });
          toast({ title: "Settlement completed", variant: "success" });
        });

        conn.on("MemberJoined", () => {
          queryClient.invalidateQueries({ queryKey: ["group", groupId] });
          queryClient.invalidateQueries({ queryKey: ["activity", groupId] });
        });

        conn.on("MemberLeft", () => {
          queryClient.invalidateQueries({ queryKey: ["group", groupId] });
          queryClient.invalidateQueries({ queryKey: ["activity", groupId] });
        });
      } catch {
        // SignalR connection failed — app still works without real-time
      }
    };

    setup();

    return () => {
      mounted = false;
      const conn = getConnection();
      conn.off("ExpenseAdded");
      conn.off("ExpenseDeleted");
      conn.off("SettlementMade");
      conn.off("MemberJoined");
      conn.off("MemberLeft");
      leaveGroup(groupId).catch(() => {});
    };
  }, [groupId, isAuthenticated, queryClient, toast]);
}
