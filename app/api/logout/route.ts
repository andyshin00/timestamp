import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.set("jwt", "", {
    httpOnly: true, //js cant read it
    secure: process.env.NODE_ENV === "production", //use https in prod
    sameSite: "strict", //csrf
    path: "/",
    maxAge: 0,
  });

  return NextResponse.json({ message: "logged out" }, { status: 200 });
}
