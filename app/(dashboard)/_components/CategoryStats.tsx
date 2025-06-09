import { GetCategoryStatsType } from "@/app/api/stats/category/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserSetting } from "@/lib/generated/prisma";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helper";
import { TransactionType } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

interface Props {
  userSettings: UserSetting;
  from: Date;
  to: Date;
}

function CategoryStats({ userSettings, from, to }: Props) {
  const statsQuery = useQuery<GetCategoryStatsType>({
    queryKey: ["overview", "stats", "category", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/category?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      ).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="relative flex flex-wrap w-full gap-2 md:flex-nowrap ">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoryCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoryCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  );
}

export default CategoryStats;

function CategoryCard({
  formatter,
  type,
  data,
}: {
  formatter: Intl.NumberFormat;
  type: TransactionType;
  data: GetCategoryStatsType;
}) {
  const filteredData = data.filter((ele) => ele.type === type);
  const total = filteredData.reduce(
    (acc, ele) => acc + (ele._sum.amount || 0),
    0
  );

  return (
    <Card className="h-80 w-full col-span-6 ">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col ">
          {type === "income" ? "Income" : "Expense"} by category
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2 ">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center ">
            No data for the selected period
            <p className="text-sm text-muted-foreground ">
              Try changing the date range or selecting a different category
              {type === "income" ? "income" : "expense"}
            </p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className="h-60 w-full px-4 ">
            <div className="flex flex-col w-full gap-4 p-4 "></div>
            {filteredData.map((item) => {
              const amt = item._sum.amount || 0;
              const percentage = (amt * 100) / (total || amt);

              return (
                <div key={item.category} className="flex flex-col gap-2 ">
                  <div className="flex items-center justify-between ">
                    <span className="flex items-center text-gray-400 ">
                      {item.categoryIcon}
                      {item.category}
                      <span className="ml-2 text-xs text-muted-foreground ">
                        ({percentage.toFixed(0)}%)
                      </span>
                    </span>

                    <span className="text-sm text-gray-400 ">
                      {formatter.format(amt)}
                    </span>
                  </div>

                  <Progress
                    value={percentage}
                    indicator={
                      type === "income" ? "bg-emerald-500" : "bg-rose-500"
                    }
                  />
                </div>
              );
            })}
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
