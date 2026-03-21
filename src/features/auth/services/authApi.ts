import api from "@/shared/lib/axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from "@/shared/types/auth.types";

export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>("/auth/refresh", { refreshToken }).then((r) => r.data),

  logout: () => api.post("/auth/logout"),

  getMe: () =>
    api.get<{ user: User }>("/auth/me").then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<{ user: User }>("/auth/profile", data).then((r) => r.data),
};
