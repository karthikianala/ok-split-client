import api from "@/shared/lib/axios";
import type {
  Expense,
  CreateExpenseRequest,
  Balance,
  SimplifiedDebt,
} from "@/shared/types/expense.types";

export const expenseApi = {
  create: (data: CreateExpenseRequest) =>
    api.post<Expense>("/expenses", data).then((r) => r.data),

  list: (
    groupId: string,
    params?: {
      category?: string;
      startDate?: string;
      endDate?: string;
      paidBy?: string;
      page?: number;
      limit?: number;
    }
  ) =>
    api
      .get<{ expenses: Expense[]; totalCount: number }>("/expenses", {
        params: { groupId, ...params },
      })
      .then((r) => r.data),

  getDetail: (id: string) =>
    api.get<Expense>(`/expenses/${id}`).then((r) => r.data),

  update: (id: string, data: CreateExpenseRequest) =>
    api.put<Expense>(`/expenses/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/expenses/${id}`),

  getBalances: (groupId: string) =>
    api
      .get<{ balances: Balance[] }>(`/groups/${groupId}/balances`)
      .then((r) => r.data.balances),

  getSimplifiedDebts: (groupId: string) =>
    api
      .get<{ debts: SimplifiedDebt[] }>(`/groups/${groupId}/simplified-debts`)
      .then((r) => r.data.debts),
};
