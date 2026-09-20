import { calculateSettlement } from "@/domain/settlement";
import { Expense, Member } from "@/domain/types";

export function SettlementResult({
  members,
  expenses,
}: {
  members: Member[];
  expenses: Expense[];
}) {
  if (expenses.length === 0) {
    return null;
  }

  const { settlements } = calculateSettlement(members, expenses);
  const memberName = (memberId: string) =>
    members.find((m) => m.id === memberId)?.name ?? "不明なメンバー";

  return (
    <div className="card">
      <h2>精算結果</h2>
      {settlements.length === 0 ? (
        <p>精算の必要はありません</p>
      ) : (
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {settlements.map((settlement, index) => (
            <li key={index} className="rowBetween">
              <span>
                <span className="negative">{memberName(settlement.fromMemberId)}</span>
                {" → "}
                <span className="positive">{memberName(settlement.toMemberId)}</span>
              </span>
              <span className="amount">¥{settlement.amount.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
