// import { OverviewSchema } from "@/schema/overview";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";

// export async function GET(req: Request) {
//   const user = await currentUser();
//   if (!user) redirect("sign-in");

//   const { searchParams } = new URL(req.url);
//   const from = searchParams.get("from");
//   const to = searchParams.get("to");

//   const queryParams = OverviewSchema.safeParse({ from, to });

//   if (!queryParams.success)
//     return new Response(queryParams.error.message, { status: 400 });

//   const stats = await getBalanceStats(
//     user.id,
//     queryParams.data.from,
//     queryParams.data.to
//   );
// }

// export type GetBalanceStatsType = Awaited<ReturnType<typeof getBalanceStats>>;
// async function getBalanceStats(userId: string, from: Date, to: Date) {}
