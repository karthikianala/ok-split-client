import type { RouteObject } from "react-router-dom";
import { GroupsPage } from "@/features/groups/pages/GroupsPage";
import { GroupDetailPage } from "@/features/groups/pages/GroupDetailPage";

export const groupRoutes: RouteObject[] = [
  { path: "/groups", element: <GroupsPage /> },
  { path: "/groups/:id", element: <GroupDetailPage /> },
];
