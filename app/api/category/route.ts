import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function GET(req: Request) {
  const user = await currentUser();

  if (!user) {
    console.error("No user found - likely unauthenticated.");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  //? get search term from the url
  const { searchParams } = new URL(req.url);
  //? get the type from the searchParams
  const paramtype = searchParams.get("type");

  //! to validate the the paramtype either to be ...
  const validator = z.enum(["expense", "income"]).nullable();

  //! validate the params
  const queryParams = validator.safeParse(paramtype);
  if (!queryParams.success)
    return NextResponse.json(queryParams.error, {
      status: 400,
    });

  //! get the data after validation
  const type = queryParams.data;
  //? call the database
  const category = await prisma.category.findMany({
    where: {
      userId: user.id,
      //   ? include the type in the filter if its defined
      ...(type && { type }),
    },
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json(category);
}
