import { Navigate, type RouteObject } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { dashboardRoutes } from "./dashboard.routes";

export const appRoutes: RouteObject[] = [
  ...authRoutes,
  ...dashboardRoutes,
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "*", element: <Navigate to="/dashboard" replace /> },
];
