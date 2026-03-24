import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../services/analyticsApi";

export function useMonthlyBreakdown(groupId?: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["analytics-monthly", groupId, startDate, endDate],
    queryFn: () => analyticsApi.monthly({ groupId, startDate, endDate }),
  });
}

export function useCategorySpend(groupId?: string, startDate?: string, endDate?: string) {
  return useQuery({
    queryKey: ["analytics-category", groupId, startDate, endDate],
    queryFn: () => analyticsApi.category({ groupId, startDate, endDate }),
  });
}

export function useGroupAnalytics(groupId: string) {
  return useQuery({
    queryKey: ["analytics-group", groupId],
    queryFn: () => analyticsApi.groupSummary(groupId),
    enabled: !!groupId,
  });
}

export function usePersonalSummary() {
  return useQuery({
    queryKey: ["personal-summary"],
    queryFn: () => analyticsApi.personalSummary(),
  });
}

export function useActivity(groupId?: string, page = 1) {
  return useQuery({
    queryKey: ["activity", groupId, page],
    queryFn: () => analyticsApi.activity({ groupId, page, limit: 30 }),
  });
}
