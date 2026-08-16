import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { db } from "@/database/index";
import { usersSchema } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/*
1.
*/

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  let body = await request.json();

  const parsed = loginSchema.safeParse(body);
  //returns {success: true, data: { email: 'string', password: 'string' } }

  //fail zod
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  //look for existing user
  const [user] = await db
    .select({
      id: usersSchema.id,
      email: usersSchema.email,
      password: usersSchema.hashedPassword,
    })
    .from(usersSchema)
    .where(eq(usersSchema.email, parsed.data.email));

  // user already exists?
  if (!user) {
    return NextResponse.json(
      { error: "Incorrect email or password" },
      { status: 400 },
    );
  }

  const passwordCompare = await bcrypt.compare(
    parsed.data.password,
    user.password,
  );

  if (!passwordCompare) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 },
    );
  }

  //sign and generate token
  const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN!, {
    expiresIn: "1h",
  });

  const cookieStore = await cookies();
  cookieStore.set("jwt", token, {
    httpOnly: true, //js cant read it
    secure: process.env.NODE_ENV === "production", //use https in prod
    sameSite: "strict", //csrf
    path: "/",
    maxAge: 60 * 60 * 6,
  });

  return NextResponse.json({ message: "logged in" }, { status: 200 });
}
