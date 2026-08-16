"use client";
import { useState } from "react";

type Timestamp = { time: number; label: string };

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VideoTabs({
  youtubeId,
  timestamps,
  transcript,
}: {
  youtubeId: string;
  timestamps: Timestamp[];
  transcript: string | null;
}) {
  const [tab, setTab] = useState<"timestamps" | "transcript">("timestamps");
  const [startTime, setStartTime] = useState(0);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-300">
        <iframe
          key={startTime}
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?start=${startTime}&autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
            {timestamps.map((t, i) => (
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
            {transcript ?? "No transcript stored for this video."}
          </p>
        )}
      </div>
    </div>
  );
}
