"use client";

import { GetBalanceStatsType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { UserSetting } from "@/lib/generated/prisma";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import React, { ReactNode, useCallback, useMemo } from "react";
import CountUP from "react-countup";

interface Props {
  userSettings: UserSetting;
  from: Date;
  to: Date;
}

function StatsCard({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetBalanceStatsType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="relative flex flex-wrap w-full gap-2 md:flex-nowrap ">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CardStats
          formatter={formatter}
          value={income}
          title="Income"
          icon={
            <TrendingUp className="w-12 h-12 items-center rounded-lg p-2 text-emerald-500 bg-emerald-400/10 " />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CardStats
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingDown className="w-12 h-12 items-center rounded-lg p-2 text-rose-500 bg-rose-400/10 " />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CardStats
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="w-12 h-12 items-center rounded-lg p-2 text-yellow-500 bg-yellow-400/10 " />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

export default StatsCard;

function CardStats({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: ReactNode;
}) {
  const format = useCallback(
    (val: number) => {
      return formatter.format(val);
    },
    [formatter]
  );

  return (
    <Card className="flex flex-row h-24 w-full items-center gap-2 p-4 ">
      {icon}
      <div className="flex flex-col items-start gap-0 ">
        <p className="text-muted-foreground ">{title}</p>
        <CountUP
          preserveValue
          redraw={false}
          end={value}
          decimal="2"
          formattingFn={format}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
