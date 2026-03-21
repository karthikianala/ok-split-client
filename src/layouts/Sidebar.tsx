import { useLogout } from "@/features/auth/hooks/useAuth";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/stores/authStore";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/groups", icon: Users, label: "Groups" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const logoutMutation = useLogout();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:bg-card">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <img
          src="/logo-icon.png"
          alt="OkSplit"
          className="h-9 w-auto object-contain"
        />
        <div className="flex flex-col">
          <span className="text-lg font-bold leading-tight">
            <span style={{ color: "#1B3A5C" }}>OK</span>
            <span style={{ color: "#2DBAA0" }}> SPLIT</span>
          </span>
          <span className="text-[6px] font-small tracking-wide text-muted-foreground">
            SHARE & SPLIT RESPONSIBLY
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium">
              {user?.fullName?.charAt(0)?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.fullName ?? "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email ?? ""}
            </p>
          </div>
          <button
            onClick={() => logoutMutation.mutate()}
            className="text-muted-foreground hover:text-foreground"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
