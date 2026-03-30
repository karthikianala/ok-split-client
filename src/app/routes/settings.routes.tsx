import type { RouteObject } from "react-router-dom";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { PaymentHistoryPage } from "@/features/payments/pages/PaymentHistoryPage";

export const settingsRoutes: RouteObject[] = [
  { path: "/settings", element: <SettingsPage /> },
  { path: "/payments", element: <PaymentHistoryPage /> },
];
