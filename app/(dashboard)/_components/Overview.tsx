"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { UserSetting } from "@/lib/generated/prisma";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";

interface Props {
  userSettings: UserSetting;
}

function Overview({ userSettings }: Props) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className=" ml-2 container flex flex-wrap items-center justify-between gap-2 py-6 ">
        <h2 className="text-3xl font-bold ">Overview</h2>
        <div className="flex items-center gap-3 ">
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(val) => {
              const { from, to } = val.range;
              //? We update the date range only if both dates are set
              if (!from || !to) return;
              if (differenceInDays(to, from) > 90)
                toast.error(
                  "The selected range is too big. Max allowed rnage is 90days!"
                );
              return;
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Overview;
