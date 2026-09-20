"use client";

import { use } from "react";
import Link from "next/link";
import { useGroup } from "@/hooks/useGroup";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseList } from "@/app/components/ExpenseList";
import { SettlementResult } from "@/app/components/SettlementResult";

export default function GroupPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const { group, isLoading: isGroupLoading } = useGroup(groupId);
  const { expenses, isLoading: isExpensesLoading } = useExpenses(groupId);

  if (isGroupLoading) {
    return (
      <div className="container">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container">
        <p>グループが見つかりません</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div>
        <h1>{group.name}</h1>
        <p style={{ opacity: 0.7 }}>
          メンバー: {group.members.map((m) => m.name).join("、")}
        </p>
      </div>

      <Link
        href={`/groups/${group.id}/expenses/new`}
        className="button"
        style={{ display: "block", textAlign: "center" }}
      >
        + 支出を追加
      </Link>

      <SettlementResult members={group.members} expenses={expenses} />

      <ExpenseList members={group.members} expenses={expenses} isLoading={isExpensesLoading} />
    </div>
  );
}
