import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { expenseParticipants, expenses, groups, members } from "@/db/schema";
import { Expense, Group } from "@/domain/types";
import { WarikanRepository } from "./repository";

export class DrizzleRepository implements WarikanRepository {
  async createGroup(name: string, memberNames: string[]): Promise<Group> {
    return db.transaction(async (tx) => {
      const [group] = await tx.insert(groups).values({ name }).returning();
      const insertedMembers = await tx
        .insert(members)
        .values(memberNames.map((memberName, position) => ({
          groupId: group.id,
          name: memberName,
          position,
        })))
        .returning();

      return {
        id: group.id,
        name: group.name,
        members: insertedMembers
          .sort((a, b) => a.position - b.position)
          .map((member) => ({ id: member.id, name: member.name })),
        createdAt: group.createdAt.toISOString(),
      };
    });
  }

  async getGroup(groupId: string): Promise<Group | null> {
    const [group] = await db.select().from(groups).where(eq(groups.id, groupId));
    if (!group) return null;

    const groupMembers = await db
      .select({ id: members.id, name: members.name })
      .from(members)
      .where(eq(members.groupId, groupId))
      .orderBy(asc(members.position));

    return {
      id: group.id,
      name: group.name,
      members: groupMembers,
      createdAt: group.createdAt.toISOString(),
    };
  }

  async addExpense(expense: Omit<Expense, "id" | "createdAt">): Promise<Expense> {
    return db.transaction(async (tx) => {
      // 立て替えた人・割る対象者が同じグループのメンバーであることを確認する
      const memberIds = [...new Set([expense.payerId, ...expense.participantIds])];
      const groupMembers = await tx
        .select({ id: members.id })
        .from(members)
        .where(and(eq(members.groupId, expense.groupId), inArray(members.id, memberIds)));
      if (groupMembers.length !== memberIds.length) {
        throw new Error("グループに属さないメンバーが含まれています");
      }

      const [inserted] = await tx
        .insert(expenses)
        .values({
          groupId: expense.groupId,
          payerId: expense.payerId,
          amount: expense.amount,
          description: expense.description,
        })
        .returning();
      await tx.insert(expenseParticipants).values(
        expense.participantIds.map((memberId) => ({ expenseId: inserted.id, memberId }))
      );

      return {
        id: inserted.id,
        groupId: inserted.groupId,
        payerId: inserted.payerId,
        amount: inserted.amount,
        description: inserted.description,
        participantIds: expense.participantIds,
        createdAt: inserted.createdAt.toISOString(),
      };
    });
  }

  async listExpenses(groupId: string): Promise<Expense[]> {
    const rows = await db
      .select()
      .from(expenses)
      .where(eq(expenses.groupId, groupId))
      .orderBy(asc(expenses.createdAt));
    if (rows.length === 0) return [];

    const participants = await db
      .select()
      .from(expenseParticipants)
      .where(inArray(expenseParticipants.expenseId, rows.map((row) => row.id)));

    const participantIdsByExpense = new Map<string, string[]>();
    for (const { expenseId, memberId } of participants) {
      const ids = participantIdsByExpense.get(expenseId) ?? [];
      ids.push(memberId);
      participantIdsByExpense.set(expenseId, ids);
    }

    return rows.map((row) => ({
      id: row.id,
      groupId: row.groupId,
      payerId: row.payerId,
      amount: row.amount,
      description: row.description,
      participantIds: participantIdsByExpense.get(row.id) ?? [],
      createdAt: row.createdAt.toISOString(),
    }));
  }
}
