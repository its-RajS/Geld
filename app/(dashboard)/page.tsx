import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import TransactionDialogs from "./_components/TransactionDialogs";
import Overview from "./_components/Overview";

async function page() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const userSetting = await prisma.userSetting.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSetting) redirect("/currency");

  return (
    <div className="h-full bg-background ">
      <div className="border-b bg-card ">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8 ">
          <p className="text-3xl font-bold pl-2">Hello, {user.firstName}! 👋</p>

          <div className="flex items-center gap-3 ">
            <TransactionDialogs
              trigger={
                <Button
                  variant={"outline"}
                  className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-shadow-white dark:bg-emerald-950 
              dark:border-emerald-500 
              dark:text-white dark:hover:bg-emerald-700 "
                >
                  New Income 🤑
                </Button>
              }
              type="income"
            />
            <TransactionDialogs
              trigger={
                <Button
                  variant={"outline"}
                  className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-shadow-white  dark:bg-rose-950
              dark:border-rose-500 dark:text-white dark:hover:bg-rose-700 "
                >
                  New expense 💸
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSetting} />
    </div>
  );
}

export default page;
