import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuthStore } from "@/shared/stores/authStore";
import { useToast } from "@/components/ui/toast";
import { authApi } from "../services/authApi";
import type { LoginRequest, RegisterRequest } from "@/shared/types/auth.types";

function getErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return fallback;
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast({
        title: "Welcome back!",
        description: `Signed in as ${data.user.fullName}`,
        variant: "success",
      });
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      toast({
        title: "Login failed",
        description: getErrorMessage(error, "Invalid email or password"),
        variant: "destructive",
      });
    },
  });
}

export function useRegister() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast({
        title: "Account created!",
        description: `Welcome to OkSplit, ${data.user.fullName}`,
        variant: "success",
      });
      navigate("/dashboard");
    },
    onError: (error: unknown) => {
      toast({
        title: "Registration failed",
        description: getErrorMessage(error, "Something went wrong"),
        variant: "destructive",
      });
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      navigate("/login");
      toast({
        title: "Logged out",
        description: "You have been signed out successfully",
        variant: "info",
      });
    },
    onError: (error: unknown) => {
      // Still logout locally even if the API call fails
      logout();
      navigate("/login");
      toast({
        title: "Logout error",
        description: getErrorMessage(error, "Signed out locally, but server logout failed"),
        variant: "destructive",
      });
    },
  });
}
