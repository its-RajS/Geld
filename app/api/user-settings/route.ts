import { prisma } from "@/lib/prisma";
import { UpdateUserCurrencySchema } from "@/schema/userSettings";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      console.error("No user found - likely unauthenticated.");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userSetting = await prisma.userSetting.findUnique({
      where: { userId: user.id },
    });

    if (!userSetting) {
      userSetting = await prisma.userSetting.create({
        data: {
          userId: user.id,
          currency: "USD",
        },
      });
    }

    revalidatePath("/");
    return NextResponse.json(userSetting);
  } catch (error) {
    console.error("Error in GET /api/user-settings:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    console.log("PATCH /api/user-settings hit");

    const body = await req.json();
    const parseBody = UpdateUserCurrencySchema.safeParse(body);

    if (!parseBody.success) throw parseBody.error;

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updated = await prisma.userSetting.update({
      where: { userId: user.id },
      data: { currency: parseBody.data.currency },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Currency Update Error:", e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
