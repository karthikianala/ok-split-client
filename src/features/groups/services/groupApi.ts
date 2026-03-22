import api from "@/shared/lib/axios";
import type {
  Group,
  GroupDetail,
  Member,
  CreateGroupRequest,
  AddMemberRequest,
} from "@/shared/types/group.types";

export const groupApi = {
  create: (data: CreateGroupRequest) =>
    api.post<Group>("/groups", data).then((r) => r.data),

  list: (page = 1, limit = 10) =>
    api
      .get<{ groups: Group[]; totalCount: number; page: number; limit: number }>(
        "/groups",
        { params: { page, limit } }
      )
      .then((r) => r.data),

  getDetail: (id: string) =>
    api.get<GroupDetail>(`/groups/${id}`).then((r) => r.data),

  update: (id: string, data: Partial<CreateGroupRequest>) =>
    api.put<Group>(`/groups/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/groups/${id}`),

  addMember: (groupId: string, data: AddMemberRequest) =>
    api.post<Member>(`/groups/${groupId}/members`, data).then((r) => r.data),

  removeMember: (groupId: string, userId: string) =>
    api.delete(`/groups/${groupId}/members/${userId}`),

  updateMemberRole: (groupId: string, userId: string, role: string) =>
    api
      .put<Member>(`/groups/${groupId}/members/${userId}/role`, { role })
      .then((r) => r.data),
};
