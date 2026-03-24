import api from "@/shared/lib/axios";
import type {
  Settlement,
  CreateSettlementRequest,
  PendingAction,
} from "@/shared/types/settlement.types";

export const settlementApi = {
  create: (data: CreateSettlementRequest) =>
    api.post<Settlement>("/settlements", data).then((r) => r.data),

  list: (groupId: string, status?: string, page = 1, limit = 20) =>
    api
      .get<{ settlements: Settlement[]; totalCount: number }>("/settlements", {
        params: { groupId, status, page, limit },
      })
      .then((r) => r.data),

  confirm: (id: string) =>
    api.post<Settlement>(`/settlements/${id}/confirm`).then((r) => r.data),

  reject: (id: string) =>
    api.post<Settlement>(`/settlements/${id}/reject`).then((r) => r.data),

  getPending: () =>
    api
      .get<{ pending: PendingAction[]; count: number }>("/settlements/pending")
      .then((r) => r.data),

  createOrder: (settlementId: string, amount: number) =>
    api
      .post<{ razorpayOrderId: string; amount: number; currency: string; key: string }>(
        "/payments/create-order",
        { settlementId, amount }
      )
      .then((r) => r.data),

  verifyPayment: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post<{ success: boolean }>("/payments/verify", data).then((r) => r.data),
};
