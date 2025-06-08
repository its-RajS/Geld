"use server";

import { prisma } from "@/lib/prisma";
import {
  TransactionDialogSchema,
  TransactionDialogType,
} from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransactionServer(form: TransactionDialogType) {
  const parseBody = TransactionDialogSchema.safeParse(form);
  if (!parseBody.success) throw new Error(parseBody.error.message);

  const user = await currentUser();
  if (!user) redirect("sign-in");

  const { amount, category, date, description, type } = parseBody.data;

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) throw new Error("category not found");

  //! gonna create transaction row in the transaction table to update the month and year history aggregate
  //? Database transaction
  await prisma.$transaction([
    //? Create user transactions
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    //? Update aggregate table for year and month based on the date,month and year of the transaction
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expenses: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expenses: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    //?Update year aggregate
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expenses: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expenses: {
          increment: type === "expense" ? amount : 0,
        },
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),
  ]);
}
