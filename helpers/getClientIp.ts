import { NextRequest } from "next/server";

// Vercel (and most proxies) set x-forwarded-for. In local dev this header
// usually isn't set, so every local request falls into the same "unknown"
// bucket for rate-limiting purposes — that's fine, it only matters in prod.
export default function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
