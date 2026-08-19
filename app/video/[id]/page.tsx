"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import formatTime from "@/helpers/formatTime";

type Video = {
  id: number;
  title: string;
  channel: string | null;
  thumbnailUrl: string | null;
  youtubeId: string;
  transcript: string | null;
  timestamps: { time: number; label: string }[];
  createdAt: string;
};

export default function VideoPage() {
  const params = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("timestamps");
  const [startTime, setStartTime] = useState(0);

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
          <p className="font-medium">
            {video.title}
            {video.channel ? ` - ${video.channel}` : ""}
          </p>
          <p className="text-sm text-gray-500">
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-300">
          <iframe
            key={startTime}
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?start=${startTime}&autoplay=1`}
            title="YouTube video player"
            allow="accelerometer;  clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="rounded-md border border-gray-300 p-3">
          <div className="mb-3 flex gap-2">
            <button
              onClick={() => setTab("timestamps")}
              className={`rounded-md border border-gray-300 px-3 py-1 ${
                tab === "timestamps" ? "bg-gray-100" : ""
              }`}
            >
              Timestamps
            </button>
            <button
              onClick={() => setTab("transcript")}
              className={`rounded-md border border-gray-300 px-3 py-1 ${
                tab === "transcript" ? "bg-gray-100" : ""
              }`}
            >
              Transcript
            </button>
          </div>

          {tab === "timestamps" && (
            <ul className="flex flex-col gap-1">
              {video.timestamps.map((t, i) => (
                <li key={i}>
                  <button
                    onClick={() => setStartTime(t.time)}
                    className="text-left hover:underline"
                  >
                    {formatTime(t.time)} — {t.label}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {tab === "transcript" && (
            <p className="whitespace-pre-line text-sm">
              {video.transcript ?? "No transcript stored for this video."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
