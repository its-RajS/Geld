"use server";

import { prisma } from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
  //validate the currency
  const parseBody = UpdateUserCurrencySchema.safeParse({
    currency,
  });

  if (!parseBody.success) throw parseBody.error;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userSetting = await prisma.userSetting.update({
    where: {
      userId: user.id,
    },
    data: {
      currency: currency,
    },
  });

  return userSetting;
}
