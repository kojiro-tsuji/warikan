import { Expense, Group } from "@/domain/types";

export interface WarikanRepository {
  createGroup(name: string, memberNames: string[]): Promise<Group>;
  getGroup(groupId: string): Promise<Group | null>;
  addExpense(expense: Omit<Expense, "id" | "createdAt">): Promise<Expense>;
  listExpenses(groupId: string): Promise<Expense[]>;
}
