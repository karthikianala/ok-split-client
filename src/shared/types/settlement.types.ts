export interface Settlement {
  id: string;
  groupId: string;
  paidBy: string;
  paidByName: string;
  paidTo: string;
  paidToName: string;
  amount: number;
  status: string;
  paymentMethod: string;
  settledAt?: string;
  createdAt: string;
}

export interface CreateSettlementRequest {
  groupId: string;
  paidBy: string;
  paidTo: string;
  amount: number;
  paymentMethod: string;
}

export interface PendingAction {
  settlementId: string;
  groupId: string;
  groupName: string;
  paidByName: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}
