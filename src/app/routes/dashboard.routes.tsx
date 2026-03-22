import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "./guards";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { groupRoutes } from "./groups.routes";

export const dashboardRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          ...groupRoutes,
          { path: "/analytics", element: <Placeholder title="Analytics" /> },
          { path: "/settings", element: <Placeholder title="Settings" /> },
        ],
      },
    ],
  },
];

function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
