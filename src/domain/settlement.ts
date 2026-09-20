import { Expense, Member, Settlement } from "./types";

export function calculateSettlement(
  members: Member[],
  expenses: Expense[]
): { balance: Record<string, number>; settlements: Settlement[] } {
  const balance: Record<string, number> = {};
  for (const member of members) {
    balance[member.id] = 0;
  }

  for (const expense of expenses) {
    const share = expense.amount / expense.participantIds.length;
    balance[expense.payerId] = (balance[expense.payerId] ?? 0) + expense.amount;
    for (const participantId of expense.participantIds) {
      balance[participantId] = (balance[participantId] ?? 0) - share;
    }
  }

  for (const memberId of Object.keys(balance)) {
    balance[memberId] = Math.round(balance[memberId]);
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
