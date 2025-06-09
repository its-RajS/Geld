import { prisma } from "@/lib/prisma";
import { OverviewSchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const queryParams = OverviewSchema.safeParse({ from, to });
  if (!queryParams.success) throw new Error(queryParams.error.message);

  const stats = await getCategoryStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return NextResponse.json(stats);
}

export type GetCategoryStatsType = Awaited<ReturnType<typeof getCategoryStats>>;
async function getCategoryStats(userId: string, from: Date, to: Date) {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "categoryIcon", "category"],
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
}
