import { cookies, headers } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const authHeader = headerStore.get('authorization');
  const bearerToken = authHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
  const token = bearerToken ?? cookieStore.get('jwt')?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_TOKEN!) as { id: number };
    return { id: payload.id };
  } catch {
    return null;
  }
}
