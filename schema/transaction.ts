import { z } from "zod";

export const TransactionDialogSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  category: z.string(),
  date: z.coerce.date(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

export type TransactionDialogType = z.infer<typeof TransactionDialogSchema>;
