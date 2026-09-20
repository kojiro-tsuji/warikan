import { Expense, Group, Member } from "@/domain/types";
import { WarikanRepository } from "./repository";

const STORAGE_KEY = "warikan:data";

type StorageShape = {
  groups: Record<string, Group>;
  expenses: Record<string, Expense[]>;
};

function readStorage(): StorageShape {
  if (typeof window === "undefined") {
    return { groups: {}, expenses: {} };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { groups: {}, expenses: {} };
  }

  try {
    return JSON.parse(raw) as StorageShape;
  } catch {
    return { groups: {}, expenses: {} };
  }
}

function writeStorage(data: StorageShape) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function createId(): string {
  return crypto.randomUUID();
}

export class LocalStorageRepository implements WarikanRepository {
  async createGroup(name: string, memberNames: string[]): Promise<Group> {
    const members: Member[] = memberNames.map((memberName) => ({
      id: createId(),
      name: memberName,
    }));

    const group: Group = {
      id: createId(),
      name,
      members,
      createdAt: new Date().toISOString(),
    };

    const data = readStorage();
    data.groups[group.id] = group;
    writeStorage(data);

    return group;
  }

  async getGroup(groupId: string): Promise<Group | null> {
    const data = readStorage();
    return data.groups[groupId] ?? null;
  }

  async addExpense(expense: Omit<Expense, "id" | "createdAt">): Promise<Expense> {
    const newExpense: Expense = {
      ...expense,
      id: createId(),
      createdAt: new Date().toISOString(),
    };

    const data = readStorage();
    const existing = data.expenses[expense.groupId] ?? [];
    data.expenses[expense.groupId] = [...existing, newExpense];
    writeStorage(data);

    return newExpense;
  }

  async listExpenses(groupId: string): Promise<Expense[]> {
    const data = readStorage();
    return data.expenses[groupId] ?? [];
  }
}
