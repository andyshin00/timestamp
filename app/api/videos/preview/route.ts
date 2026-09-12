import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/index";
import { previewRequestsSchema } from "@/database/schema";
import { generateVideoData, GenerationError } from "@/helpers/generateVideoData";
import getClientIp from "@/helpers/getClientIp";
import { and, eq, gte } from "drizzle-orm";
import { videoRequestSchema } from "@/zodSchema";

const FREE_LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Unauthenticated "try it free" generation for the root page. Same pipeline
// as POST /api/videos, but nothing is saved to a user's library — instead
// each attempt is logged by IP so we can cap it to a few per hour.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const windowStart = new Date(Date.now() - WINDOW_MS);

  const recent = await db
    .select({ id: previewRequestsSchema.id })
    .from(previewRequestsSchema)
    .where(
      and(
        eq(previewRequestsSchema.ip, ip),
        gte(previewRequestsSchema.createdAt, windowStart),
      ),
    );

  if (recent.length >= FREE_LIMIT) {
    return NextResponse.json(
      {
        error: `You've hit the free limit (${FREE_LIMIT} per hour). Create an account for unlimited use.`,
      },
      { status: 429 },
    );
  }

  const body = await request.json();
  const parsed = videoRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  // Count this attempt toward the limit regardless of outcome — a failed
  // generation (bad URL, no transcript) still cost a request.
  await db.insert(previewRequestsSchema).values({ ip });

  try {
    const data = await generateVideoData(parsed.data.youtubeUrl);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    if (err instanceof GenerationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}
