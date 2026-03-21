import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/shared/stores/authStore";
import api from "@/shared/lib/axios";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { accessToken, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [accessToken, setUser, setLoading, logout]);

  return <>{children}</>;
}
