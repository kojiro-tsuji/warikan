"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGroup } from "@/hooks/useGroup";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseForm } from "@/components/ExpenseForm";
import { StatusMessage } from "@/components/StatusMessage";

export default function NewExpensePage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);
  const router = useRouter();
  const { group, isLoading } = useGroup(groupId);
  const { addExpense } = useExpenses(groupId);

  if (isLoading) {
    return <StatusMessage message="読み込み中..." />;
  }

  if (!group) {
    return <StatusMessage message="グループが見つかりません" showHomeLink />;
  }

  async function handleSubmit(input: {
    payerId: string;
    amount: number;
    description: string;
    participantIds: string[];
  }) {
    await addExpense(input);
    router.push(`/groups/${groupId}`);
  }

  return (
    <div className="container">
      <Link href={`/groups/${groupId}`} className="backLink">
        ← {group.name}に戻る
      </Link>
      <h1 className="tape" style={{ fontSize: 20 }}>支出を追加</h1>
      <ExpenseForm members={group.members} onSubmit={handleSubmit} />
    </div>
  );
}
