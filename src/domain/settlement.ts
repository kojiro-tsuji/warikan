import { Expense, Member, Settlement } from "./types";

export function calculateSettlement(
  members: Member[],
  expenses: Expense[]
): { balance: Record<string, number>; settlements: Settlement[] } {
  const balance: Record<string, number> = {};
  for (const member of members) {
    balance[member.id] = 0;
  }

  const memberOrder = new Map(members.map((member, index) => [member.id, index]));
  const orderOf = (memberId: string) => memberOrder.get(memberId) ?? Number.MAX_SAFE_INTEGER;

  // 1円単位で割り、割り切れない端数はメンバー順に1円ずつ負担する。
  // 残高が常に整数かつ合計0になるので、精算額に端数のズレが出ない
  for (const expense of expenses) {
    const participantIds = [...expense.participantIds].sort((a, b) => orderOf(a) - orderOf(b));
    const baseShare = Math.floor(expense.amount / participantIds.length);
    let remainder = expense.amount - baseShare * participantIds.length;

    balance[expense.payerId] = (balance[expense.payerId] ?? 0) + expense.amount;
    for (const participantId of participantIds) {
      const share = remainder > 0 ? baseShare + 1 : baseShare;
      if (remainder > 0) remainder--;
      balance[participantId] = (balance[participantId] ?? 0) - share;
    }
  }

  const creditors = Object.entries(balance)
    .filter(([, amount]) => amount > 0)
    .map(([memberId, amount]) => ({ memberId, amount }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = Object.entries(balance)
    .filter(([, amount]) => amount < 0)
    .map(([memberId, amount]) => ({ memberId, amount: -amount }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: Settlement[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      settlements.push({
        fromMemberId: debtor.memberId,
        toMemberId: creditor.memberId,
        amount,
      });
    }

    debtor.amount -= amount;
    creditor.amount -= amount;

    if (debtor.amount === 0) i++;
    if (creditor.amount === 0) j++;
  }

  return { balance, settlements };
}
