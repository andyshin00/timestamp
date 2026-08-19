"use client";
import logout from "@/helpers/logout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

type Video = {
  id: number;
  title: string;
  channel: string | null;
  thumbnailUrl: string | null;
  createdAt: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);

  async function loadVideos() {
    const res = await fetch("/api/videos", { method: "GET" });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setVideos(data);
  }

  useEffect(() => {
    loadVideos();
  }, []);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeUrl: url }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setUrl("");
    loadVideos();
  }

  return (
    <>
      <button
        className="border rounded"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        logout
      </button>
      <h1 className="">Paste a Youtube Link</h1>
      <form onSubmit={handleSubmit}>
        <input
          onChange={(e) => setUrl(e.currentTarget.value)}
          value={url}
          type="text"
          placeholder="Youtube URL goes here"
        />
        <button className="border rounded" type="submit" disabled={loading}>
          {loading ? "Generating..." : "Get Timestamps"}
        </button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
      <h2>Your library</h2>
      <div className="flex flex-col gap-2">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={`/video/${video.id}`}
            className="flex items-center gap-3 rounded-md border border-gray-300 p-2"
          >
            {video.thumbnailUrl && (
              <img
                src={video.thumbnailUrl}
                alt=""
                className="h-12 w-20 rounded object-cover"
              />
            )}
            <div>
              <p>
                {video.title}
                {video.channel ? ` - ${video.channel}` : ""}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(video.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
