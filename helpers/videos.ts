import { Video, VideoResultData } from "@/types";

export async function fetchVideos(): Promise<Video[]> {
  const res = await fetch("/api/videos");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function fetchVideo(id: number): Promise<Video> {
  const res = await fetch(`/api/videos/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function createVideo(youtubeUrl: string): Promise<Video> {
  const res = await fetch("/api/videos", {
    method: "POST",
    body: JSON.stringify({ youtubeUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

// Anonymous, unauthenticated generation for the root page's try-it-free
// panel. Nothing is saved — the response is the generated data only.
export async function generatePreview(
  youtubeUrl: string,
): Promise<VideoResultData> {
  const res = await fetch("/api/videos/preview", {
    method: "POST",
    body: JSON.stringify({ youtubeUrl }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

export async function deleteVideo(id: number): Promise<void> {
  const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
}
