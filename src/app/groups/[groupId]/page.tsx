"use client";

import { use } from "react";
import Link from "next/link";
import { useGroup } from "@/hooks/useGroup";
import { useExpenses } from "@/hooks/useExpenses";
import { GroupHeader } from "@/components/GroupHeader";
import { ExpenseList } from "@/components/ExpenseList";
import { SettlementResult } from "@/components/SettlementResult";
import { StatusMessage } from "@/components/StatusMessage";

export default function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const { group, isLoading: isGroupLoading } = useGroup(groupId);
  const { expenses, isLoading: isExpensesLoading } = useExpenses(groupId);

  if (isGroupLoading) {
    return <StatusMessage message="読み込み中..." />;
  }

  if (!group) {
    return <StatusMessage message="グループが見つかりません" showHomeLink />;
  }

  return (
    <div className="container">
      <GroupHeader group={group} expenses={expenses} />

      <Link href={`/groups/${group.id}/expenses/new`} className="button">
        ＋ 支出を追加
      </Link>

      <SettlementResult members={group.members} expenses={expenses} />

      <ExpenseList members={group.members} expenses={expenses} isLoading={isExpensesLoading} />
    </div>
  );
}
