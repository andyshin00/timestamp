import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { db } from "@/database/index";
import { usersSchema } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
/*
1. validate request with zod
2. check db for existing user
3. hash pw
4. store user in db
5. send response
*/

const registerSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  let body = await request.json();

  const parsed = registerSchema.safeParse(body);
  //returns {success: true, data: { email: 'test.com', password: 'abasdasdas' } }

  //fail zod
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  //look for existing user
  const [existingUser] = await db
    .select({ id: usersSchema.id })
    .from(usersSchema)
    .where(eq(usersSchema.email, parsed.data.email));

  // user already exists?
  if (existingUser) {
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 },
    );
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  const [newUser] = await db
    .insert(usersSchema)
    .values({ email: parsed.data.email, hashedPassword })
    .returning({ id: usersSchema.id });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_TOKEN!, {
    expiresIn: "1h",
  });

  const cookieStore = await cookies();

  cookieStore.set("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  return NextResponse.json({ message: "Account created", status: "201" });
}
