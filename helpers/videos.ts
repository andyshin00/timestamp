import { Video } from "@/types";

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

export async function deleteVideo(id: number): Promise<void> {
  const res = await fetch(`/api/videos/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
}
