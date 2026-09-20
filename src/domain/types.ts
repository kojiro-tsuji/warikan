export type Member = {
  id: string;
  name: string;
};

export type Group = {
  id: string;
  name: string;
  members: Member[];
  createdAt: string;
};

export type Expense = {
  id: string;
  groupId: string;
  payerId: string;
  amount: number;
  description: string;
  participantIds: string[];
  createdAt: string;
};

export type Settlement = {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
};
