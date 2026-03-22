export interface Group {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdBy: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupDetail {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdBy: string;
  createdByName: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
}

export interface Member {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: string;
  joinedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface AddMemberRequest {
  email: string;
}
