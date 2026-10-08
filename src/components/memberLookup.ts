import { Member } from "@/domain/types";

export function createMemberLookup(members: Member[]) {
  const indexById = new Map(members.map((member, index) => [member.id, index]));
  return {
    name: (memberId: string) =>
      members[indexById.get(memberId) ?? -1]?.name ?? "不明なメンバー",
    index: (memberId: string) => indexById.get(memberId) ?? -1,
  };
}
