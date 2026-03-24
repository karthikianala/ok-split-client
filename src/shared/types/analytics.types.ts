export interface MonthlyBreakdown {
  month: string;
  totalSpent: number;
  totalOwed: number;
  totalPaid: number;
}

export interface CategorySpend {
  category: string;
  amount: number;
  percentage: number;
}

export interface GroupAnalytics {
  totalExpenses: number;
  totalSettled: number;
  pendingAmount: number;
  memberCount: number;
  topSpender?: string;
  topSpenderAmount: number;
}

export interface PersonalSummary {
  totalOwed: number;
  totalOwe: number;
  netBalance: number;
  groupCount: number;
  expenseCount: number;
}

export interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  metadata?: string;
  createdAt: string;
  userName: string;
  groupName?: string;
}
