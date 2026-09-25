import extractVideoId from "@/helpers/extractVideoId";
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

// Everything about turning a YouTube URL into timestamps lives here so
// POST /api/videos can just call it and save the result.
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

  // Scraping YouTube's caption endpoints directly (the old approach) gets
  // blocked from datacenter IPs like Vercel's — Supadata proxies around
  // that, so this runs the same in prod as it does locally.
  const transcriptRes = await fetch(
    `https://api.supadata.ai/v1/transcript?url=${encodeURIComponent(youtubeUrl)}&lang=en`,
    { headers: { "x-api-key": process.env.SUPADATA_API_KEY! } },
  );
  if (!transcriptRes.ok) {
    console.error(
      `Supadata transcript fetch failed (${transcriptRes.status}):`,
      await transcriptRes.text(),
    );
    throw new GenerationError("This video doesn't have a transcript available");
  }
  const transcriptData: { content: { offset: number; text: string }[] } =
    await transcriptRes.json();

  const transformedTranscript = transcriptData.content
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
