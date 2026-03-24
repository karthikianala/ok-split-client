import api from "@/shared/lib/axios";
import type {
  MonthlyBreakdown,
  CategorySpend,
  GroupAnalytics,
  PersonalSummary,
  Activity,
} from "@/shared/types/analytics.types";

export const analyticsApi = {
  monthly: (params?: { groupId?: string; startDate?: string; endDate?: string }) =>
    api.get<{ data: MonthlyBreakdown[] }>("/analytics/monthly", { params }).then((r) => r.data.data),

  category: (params?: { groupId?: string; startDate?: string; endDate?: string }) =>
    api.get<{ data: CategorySpend[] }>("/analytics/category", { params }).then((r) => r.data.data),

  groupSummary: (groupId: string) =>
    api.get<GroupAnalytics>(`/analytics/group-summary/${groupId}`).then((r) => r.data),

  personalSummary: () =>
    api.get<PersonalSummary>("/analytics/personal-summary").then((r) => r.data),

  activity: (params?: { groupId?: string; page?: number; limit?: number }) =>
    api
      .get<{ activities: Activity[]; totalCount: number }>("/activity", { params })
      .then((r) => r.data),
};
