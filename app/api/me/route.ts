import { NextResponse } from "next/server";
import { db } from "@/database/index";
import { usersSchema } from "@/database/schema";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const [row] = await db
    .select({ email: usersSchema.email })
    .from(usersSchema)
    .where(eq(usersSchema.id, user.id));

  if (!row) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(row);
}
