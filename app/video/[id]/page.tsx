"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import formatTime from "@/helpers/formatTime";
import { Video } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VideoPage() {
  const params = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("timestamps");

  useEffect(() => {
    async function loadVideo() {
      const res = await fetch(`/api/videos/${params.id}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setVideo(data);
    }

    loadVideo();
  }, [params.id]);

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  if (!video) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Link
        href="/dashboard"
        className=" mx-auto max-w-5xl px-6 pt-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      {/* Top Video Card */}
      <div className="mx-auto max-w-5xl p-6 text-gray-900">
        <div className="mb-4 flex items-center gap-3 rounded-md border border-gray-300 p-3">
          {video.thumbnailUrl && (
            <img
              src={video.thumbnailUrl}
              alt=""
              className="h-14 w-24 rounded object-cover"
            />
          )}
          <div>
            <p className="font-semibold">{video.title}</p>
            <p className="text-sm text-gray-500">
              {video.channel}
              {video.channel ? " · " : ""}
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* iframe */}
          <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-300">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
              title="YouTube video player"
              allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {/* timestamps/transcript */}
          <div className="rounded-md border border-gray-300 p-3">
            <div className="mb-3 flex gap-2">
              <button
                onClick={() => setTab("timestamps")}
                className={`rounded-md border border-gray-300 px-3 py-1 ${
                  tab === "timestamps" ? "bg-gray-300" : ""
                }`}
              >
                Timestamps
              </button>
              <button
                onClick={() => setTab("transcript")}
                className={`rounded-md border border-gray-300 px-3 py-1 ${
                  tab === "transcript" ? "bg-gray-300" : ""
                }`}
              >
                Transcript
              </button>
            </div>

            {tab === "timestamps" && (
              <ul className="flex flex-col gap-1">
                {video.timestamps.map((t, i) => (
                  <li key={i}>
                    {formatTime(t.time)} — {t.label}
                  </li>
                ))}
              </ul>
            )}

            {tab === "transcript" && (
              <p className="text-sm">{video.transcript}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
