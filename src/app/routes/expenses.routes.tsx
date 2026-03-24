import type { RouteObject } from "react-router-dom";
import { ExpenseDetailPage } from "@/features/expenses/pages/ExpenseDetailPage";

export const expenseRoutes: RouteObject[] = [
  { path: "/expenses/:id", element: <ExpenseDetailPage /> },
];
