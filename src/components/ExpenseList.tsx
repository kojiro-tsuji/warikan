import { Expense, Member } from "@/domain/types";
import { createMemberLookup } from "./memberLookup";

export function ExpenseList({
  members,
  expenses,
  isLoading,
}: {
  members: Member[];
  expenses: Expense[];
  isLoading: boolean;
}) {
  const lookup = createMemberLookup(members);

  function participantsLabel(participantIds: string[]) {
    if (participantIds.length === members.length) return "全員で割り勘";
    return (
      [...participantIds]
        .sort((a, b) => lookup.index(a) - lookup.index(b))
        .map(lookup.name)
        .join("・") + "で割り勘"
    );
  }

  if (isLoading) {
    return (
      <div className="card emptyState">
        <p className="muted">読み込み中...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card emptyState">
        <p>まだ支出がありません</p>
        <p className="muted">「＋ 支出を追加」から、立て替えた支出を追加しましょう</p>
      </div>
    );
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <section className="card" style={{ gap: 4 }}>
      <h2 className="tape" style={{ marginBottom: 8 }}>支出一覧</h2>
      <ul>
        {expenses.map((expense) => {
          const payerName = lookup.name(expense.payerId);
          return (
            <li key={expense.id} className="expenseRow">
              <div className="expenseBody">
                <p className="expenseTitle">{expense.description}</p>
                <p className="muted">
                  {payerName}が立て替え・{participantsLabel(expense.participantIds)}
                </p>
              </div>
              <span className="amount">¥{expense.amount.toLocaleString()}</span>
            </li>
          );
        })}
      </ul>
      <div className="rowBetween expenseTotal">
        <span className="muted">合計</span>
        <span className="amount" style={{ fontSize: 18 }}>¥{total.toLocaleString()}</span>
      </div>
    </section>
  );
}
