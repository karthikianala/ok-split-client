import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/shared/stores/authStore";
import { useToast } from "@/components/ui/toast";
import { authApi } from "@/features/auth/services/authApi";
import { useLogout } from "@/features/auth/hooks/useAuth";

const schema = z.object({
  fullName: z.string().min(1, "Required").max(100),
  phone: z.string().max(15).optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

export function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const logoutMutation = useLogout();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: (data: FormData) =>
      authApi.updateProfile({
        fullName: data.fullName,
        phone: data.phone || undefined,
      }),
    onSuccess: (data) => {
      setUser(data.user);
      toast({ title: "Profile updated!", variant: "success" });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => updateProfile.mutate(data))}
            className="space-y-4 max-w-md"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input value={user?.email ?? ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input {...register("fullName")} />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Phone <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input type="tel" {...register("phone")} />
            </div>

            <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Logout */}
      <Card className="border-destructive/20">
        <CardContent className="pt-6">
          <Button
            variant="destructive"
            className="w-full sm:w-auto"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutMutation.isPending ? "Logging out..." : "Log out"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
