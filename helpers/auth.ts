import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN!) as { id: number };
    return { id: payload.id };
  } catch {
    return null;
  }
}
