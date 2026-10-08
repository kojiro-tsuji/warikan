import { calculateSettlement } from "@/domain/settlement";
import { Expense, Member } from "@/domain/types";
import { createMemberLookup } from "./memberLookup";

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
  const lookup = createMemberLookup(members);

  return (
    <section className="card" style={{ gap: 4 }}>
      <div className="sectionHead">
        <h2 className="tape">精算結果</h2>
        {settlements.length > 0 && (
          <span className="stamp">
            精算
            <br />
            {settlements.length}件
          </span>
        )}
      </div>

      {settlements.length === 0 ? (
        <div className="emptyState" style={{ display: "flex", flexDirection: "column" }}>
          <p>精算の必要はありません</p>
          <p className="muted">全員の負担がぴったり揃っています</p>
        </div>
      ) : (
        <>
          <p className="muted">この通りに送金すると、全員ぴったり精算できます。</p>
          <ul>
            {settlements.map((settlement, index) => {
              const from = lookup.name(settlement.fromMemberId);
              const to = lookup.name(settlement.toMemberId);
              return (
                <li key={index} className="settlementRow">
                  <div className="settlementPeople" aria-label={`${from}が${to}に払う`}>
                    <span className="personName">{from}</span>
                    <span className="arrow" aria-hidden="true">→</span>
                    <span className="personName">{to}</span>
                    <span className="roleBadge rolePay" aria-hidden="true">払う</span>
                    <span className="roleBadge roleReceive" aria-hidden="true">受け取る</span>
                  </div>
                  <span className="amount settlementAmount">
                    ¥{settlement.amount.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}
