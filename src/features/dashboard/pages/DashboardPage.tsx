import { useAuthStore } from "@/shared/stores/authStore";

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.fullName ?? "User"}!</h1>
      <p className="mt-2 text-muted-foreground">
        Your personal summary will appear here.
      </p>
    </div>
  );
}
