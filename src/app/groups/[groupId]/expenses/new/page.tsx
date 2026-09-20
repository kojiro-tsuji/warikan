"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useGroup } from "@/hooks/useGroup";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseForm } from "@/components/ExpenseForm";

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
      <h1>支出を追加</h1>
      <ExpenseForm members={group.members} onSubmit={handleSubmit} />
    </div>
  );
}
