import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/index";
import { videosSchema } from "@/database/schema";
import { getCurrentUser } from "@/helpers/getCurrentUser";
import { generateVideoData, GenerationError } from "@/helpers/generateVideoData";
import { eq, desc } from "drizzle-orm";
import { videoRequestSchema } from "@/zodSchema";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const body = await request.json();

  const parsed = videoRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  try {
    const data = await generateVideoData(parsed.data.youtubeUrl);

    const [video] = await db
      .insert(videosSchema)
      .values({ userId: user.id, ...data })
      .returning();

    return NextResponse.json(video, { status: 201 });
  } catch (err) {
    if (err instanceof GenerationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    throw err;
  }
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const videos = await db
    .select()
    .from(videosSchema)
    .where(eq(videosSchema.userId, user.id))
    .orderBy(desc(videosSchema.createdAt));

  return NextResponse.json(videos);
}
