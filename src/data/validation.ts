import { z } from "zod";

export const idSchema = z.uuid();

export const createGroupInputSchema = z.object({
  name: z.string().trim().min(1).max(50),
  memberNames: z.array(z.string().trim().min(1).max(30)).min(2).max(50),
});

export const addExpenseInputSchema = z.object({
  groupId: idSchema,
  payerId: idSchema,
  amount: z.number().int().positive().max(100_000_000),
  description: z.string().trim().min(1).max(100),
  participantIds: z
    .array(idSchema)
    .min(1)
    .max(50)
    .transform((ids) => [...new Set(ids)]),
});
