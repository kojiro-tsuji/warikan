import { Expense, Group } from "@/domain/types";
import { ShareLink } from "./ShareLink";

export function GroupHeader({ group, expenses }: { group: Group; expenses: Expense[] }) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="card">
      <div>
        <p className="label">グループ</p>
        <h1 className="groupName">{group.name}</h1>
        <p className="muted" style={{ marginTop: 4 }}>
          メンバー：{group.members.map((m) => m.name).join("、")}
        </p>
      </div>

      <dl className="stats">
        <div className="stat">
          <dt className="label">合計</dt>
          <dd className="amount statValue">¥{total.toLocaleString()}</dd>
        </div>
        <div className="stat">
          <dt className="label">メンバー</dt>
          <dd className="amount statValue">{group.members.length}人</dd>
        </div>
        <div className="stat">
          <dt className="label">支出</dt>
          <dd className="amount statValue">{expenses.length}件</dd>
        </div>
      </dl>

      <ShareLink />
    </div>
  );
}
