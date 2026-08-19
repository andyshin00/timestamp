import { NextRequest, NextResponse } from "next/server";
import { db } from "@/database/index";
import { videosSchema } from "@/database/schema";
import { getCurrentUser } from "@/helpers/auth";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  }

  const { id } = await params;
  const [video] = await db
    .select()
    .from(videosSchema)
    .where(eq(videosSchema.id, Number(id)));

  if (!video || video.userId !== user.id) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }

  return NextResponse.json(video);
}
