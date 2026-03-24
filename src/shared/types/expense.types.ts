export interface Expense {
  id: string;
  groupId: string;
  paidBy: string;
  paidByName: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  splitType: string;
  notes?: string;
  splits: SplitDetail[];
  createdAt: string;
}

export interface SplitDetail {
  userId: string;
  fullName: string;
  email: string;
  owedAmount: number;
  isSettled: boolean;
}

export interface CreateExpenseRequest {
  groupId: string;
  description: string;
  amount: number;
  category: string;
  splitType: string;
  splits: SplitInput[];
  notes?: string;
}

export interface SplitInput {
  userId: string;
  amount?: number;
  percentage?: number;
}

export interface Balance {
  userId: string;
  fullName: string;
  balance: number;
}

export interface SimplifiedDebt {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amount: number;
}

export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Other",
] as const;
