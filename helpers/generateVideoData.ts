import extractVideoId from "@/helpers/extractVideoId";
import { fetchTranscript } from "youtube-transcript";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { timestampsSchema } from "@/zodSchema";

const client = new Anthropic();

export class GenerationError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export type GeneratedVideo = {
  youtubeId: string;
  title: string;
  channel: string | null;
  thumbnailUrl: string | null;
  transcript: string;
  timestamps: { time: number; label: string }[];
};

// Shared by POST /api/videos (saves the result) and POST /api/videos/preview
// (doesn't) — everything about turning a YouTube URL into timestamps lives
// here so the two routes can't drift apart.
export async function generateVideoData(
  youtubeUrl: string,
): Promise<GeneratedVideo> {
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    throw new GenerationError("Couldn't find a video ID in that URL");
  }

  const oembedRes = await fetch(
    `https://www.youtube.com/oembed?url=https://youtube.com/watch?v=${videoId}&format=json`,
  );
  if (!oembedRes.ok) {
    throw new GenerationError("Couldn't find that video");
  }
  const oembed = await oembedRes.json();

  let rawTranscript;
  try {
    rawTranscript = await fetchTranscript(videoId, { lang: "en" });
  } catch {
    throw new GenerationError(
      "This video doesn't have a transcript available",
    );
  }

  const transformedTranscript = rawTranscript
    .map((line) => `[${Math.round(line.offset / 1000)}s] ${line.text}`)
    .join("\n");

  const aiResponse = await client.messages.parse({
    model: "claude-sonnet-5",
    max_tokens: 2048,
    thinking: { type: "disabled" },
    output_config: {
      effort: "low",
      format: zodOutputFormat(timestampsSchema),
    },
    messages: [
      {
        role: "user",
        content: `Given this video transcript with timestamps, identify key topic sections and give each a short label.\n\n${transformedTranscript}`,
      },
    ],
  });

  return {
    youtubeId: videoId,
    title: oembed.title,
    channel: oembed.author_name,
    thumbnailUrl: oembed.thumbnail_url,
    transcript: transformedTranscript,
    timestamps: aiResponse.parsed_output!.timestamps,
  };
}
