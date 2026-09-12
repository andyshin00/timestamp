import { videosSchema } from "@/database/schema";

export type Video = Omit<typeof videosSchema.$inferSelect, "userId" | "createdAt"> & {
  createdAt: string;
};

// The subset of a video that <VideoResult> needs to render. A saved `Video`
// satisfies this directly; an anonymous /api/videos/preview result does too
// (it just has no `createdAt`, since nothing was saved).
export type VideoResultData = Pick<
  Video,
  "youtubeId" | "title" | "channel" | "thumbnailUrl" | "transcript" | "timestamps"
> & {
  createdAt?: string;
};
