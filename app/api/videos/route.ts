import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";
import { db } from "@/database/index";
import { videosSchema } from "@/database/schema";
import { getCurrentUser } from "@/helpers/auth";
import { fetchTranscript } from "youtube-transcript";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { eq, desc } from "drizzle-orm";

const client = new Anthropic();

const videoRequestSchema = z.object({
  youtubeUrl: z.string(),
});

const TimestampsSchema = z.object({
  timestamps: z.array(
    z.object({
      time: z.number(),
      label: z.string(),
    }),
  ),
});

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

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

  const videoId = extractVideoId(parsed.data.youtubeUrl);
  if (!videoId) {
    return NextResponse.json(
      { error: "Couldn't find a video ID in that URL" },
      { status: 400 },
    );
  }

  const oembedRes = await fetch(
    `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${videoId}&format=json`,
  );
  if (!oembedRes.ok) {
    return NextResponse.json(
      { error: "Couldn't find that video" },
      { status: 400 },
    );
  }
  const oembed = await oembedRes.json();

  let rawTranscript;
  try {
    rawTranscript = await fetchTranscript(videoId, { lang: "en" });
  } catch {
    return NextResponse.json(
      { error: "This video doesn't have a transcript available" },
      { status: 400 },
    );
  }

  const transcriptText = rawTranscript
    .map((line) => `[${Math.round(line.offset / 1000)}s] ${line.text}`)
    .join("\n");

  const aiResponse = await client.messages.parse({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    thinking: { type: "disabled" },
    output_config: {
      effort: "low",
      format: zodOutputFormat(TimestampsSchema),
    },
    messages: [
      {
        role: "user",
        content: `Given this video transcript with timestamps, identify natural topic sections and give each a short label.\n\n${transcriptText}`,
      },
    ],
  });

  const [video] = await db
    .insert(videosSchema)
    .values({
      userId: user.id,
      youtubeId: videoId,
      title: oembed.title,
      channel: oembed.author_name,
      thumbnailUrl: oembed.thumbnail_url,
      transcript: transcriptText,
      timestamps: aiResponse.parsed_output!.timestamps,
    })
    .returning();

  return NextResponse.json(video, { status: 201 });
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
