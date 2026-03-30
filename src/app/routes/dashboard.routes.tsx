import type { RouteObject } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { ProtectedRoute } from "./guards";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { groupRoutes } from "./groups.routes";
import { expenseRoutes } from "./expenses.routes";
import { analyticsRoutes } from "./analytics.routes";
import { settingsRoutes } from "./settings.routes";

export const dashboardRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          ...groupRoutes,
          ...expenseRoutes,
          ...analyticsRoutes,
          ...settingsRoutes,
        ],
      },
    ],
  },
];
