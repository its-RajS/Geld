"use server";

import { prisma } from "@/lib/prisma";
import { CategorySchema, CategorySchemaType } from "@/schema/category";
import { currentUser } from "@clerk/nextjs/server";

// In your ServerCategories action
export async function ServerCategories(form: CategorySchemaType) {
  console.log("Server action called with:", form);

  const parseBody = CategorySchema.safeParse(form);
  if (!parseBody.success) {
    const errorMsg = `Validation failed: ${parseBody.error.message}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const user = await currentUser();
  if (!user) {
    console.error("No user authenticated");
    throw new Error("Unauthorized");
  }

  // !Ge the data from the form
  const { name, icon, type } = parseBody.data;
  console.log("Creating category for user:", user.id, "with data:", {
    name,
    icon,
    type,
  });

  try {
    const result = await prisma.category.create({
      data: {
        userId: user.id,
        name,
        icon,
        type,
      },
    });

    console.log("Database write successful:", result);
    return result;
  } catch (dbError) {
    console.error("Database error:", dbError);
    throw new Error("Failed to create category in database");
  }
}
