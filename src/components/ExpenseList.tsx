import { Expense, Member } from "@/domain/types";

export function ExpenseList({
  members,
  expenses,
  isLoading,
}: {
  members: Member[];
  expenses: Expense[];
  isLoading: boolean;
}) {
  const memberName = (memberId: string) =>
    members.find((m) => m.id === memberId)?.name ?? "不明なメンバー";

  if (isLoading) {
    return <p>読み込み中...</p>;
  }

  if (expenses.length === 0) {
    return <p>まだ支出がありません</p>;
  }

  return (
    <div className="card">
      <h2>支出一覧</h2>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
        {expenses.map((expense) => (
          <li key={expense.id} className="rowBetween">
            <div>
              <div>{expense.description}</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>
                {memberName(expense.payerId)}が立て替え・
                {expense.participantIds.map(memberName).join("、")}で割り勘
              </div>
            </div>
            <span className="amount">¥{expense.amount.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
