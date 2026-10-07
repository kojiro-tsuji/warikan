import { Expense, Group } from "@/domain/types";
import { addExpenseAction, createGroupAction } from "./actions";
import { WarikanRepository } from "./repository";

// ブラウザ側の中継役。書き込みは Server Actions、読み取りは Route Handler を呼ぶ
export class ApiRepository implements WarikanRepository {
  createGroup(name: string, memberNames: string[]): Promise<Group> {
    return createGroupAction(name, memberNames);
  }

  async getGroup(groupId: string): Promise<Group | null> {
    const response = await fetch(`/api/groups/${encodeURIComponent(groupId)}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("グループの取得に失敗しました");
    return response.json();
  }

  addExpense(expense: Omit<Expense, "id" | "createdAt">): Promise<Expense> {
    return addExpenseAction(expense);
  }

  async listExpenses(groupId: string): Promise<Expense[]> {
    const response = await fetch(`/api/groups/${encodeURIComponent(groupId)}/expenses`);
    if (!response.ok) throw new Error("支出の取得に失敗しました");
    return response.json();
  }
}
