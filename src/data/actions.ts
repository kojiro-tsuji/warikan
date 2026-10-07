"use server";

import { Expense, Group } from "@/domain/types";
import { DrizzleRepository } from "./drizzleRepository";
import { addExpenseInputSchema, createGroupInputSchema } from "./validation";

const repository = new DrizzleRepository();

export async function createGroupAction(name: string, memberNames: string[]): Promise<Group> {
  const input = createGroupInputSchema.parse({ name, memberNames });
  return repository.createGroup(input.name, input.memberNames);
}

export async function addExpenseAction(
  expense: Omit<Expense, "id" | "createdAt">
): Promise<Expense> {
  const input = addExpenseInputSchema.parse(expense);
  return repository.addExpense(input);
}
