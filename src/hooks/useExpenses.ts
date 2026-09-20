"use client";

import useSWR from "swr";
import { Expense } from "@/domain/types";
import { useRepository } from "./useRepository";

export function useExpenses(groupId: string) {
  const repository = useRepository();
  const { data, isLoading, mutate } = useSWR<Expense[]>(
    ["expenses", groupId],
    () => repository.listExpenses(groupId)
  );

  async function addExpense(
    expense: Omit<Expense, "id" | "createdAt" | "groupId">
  ) {
    await repository.addExpense({ ...expense, groupId });
    await mutate();
  }

  return { expenses: data ?? [], isLoading, addExpense };
}
