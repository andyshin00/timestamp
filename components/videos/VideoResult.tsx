"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import formatTime from "@/helpers/formatTime";
import type { Video } from "@/types";

interface YTPlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, options: object) => YTPlayer;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const YT_API_SRC = "https://www.youtube.com/iframe_api";

// The video embed + timestamps/transcript panel, used on the saved video
// page. Transcript lines are stored as "[12s] some text", one per line. Parsed
// here so each line can be rendered on its own row instead of running
// together as one paragraph (newlines collapse to spaces in HTML).
const TRANSCRIPT_LINE = /^\[(\d+)s\]\s*(.*)$/;

function parseTranscript(transcript: string) {
  return transcript
    .split("\n")
    .map((line) => {
      const match = line.match(TRANSCRIPT_LINE);
      return match ? { time: Number(match[1]), text: match[2] } : null;
    })
    .filter((line): line is { time: number; text: string } => line !== null);
}

export default function VideoResult({ video }: { video: Video }) {
  const [tab, setTab] = useState("timestamps");
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    function createPlayer() {
      playerRef.current = new window.YT.Player(
        `yt-player-${video.youtubeId}`,
        {},
      );
    }

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      if (!document.querySelector(`script[src="${YT_API_SRC}"]`)) {
        const tag = document.createElement("script");
        tag.src = YT_API_SRC;
        document.body.appendChild(tag);
      }
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [video.youtubeId]);

  function handleSeek(time: number) {
    const player = playerRef.current;
    if (player) {
      player.seekTo(time, true);
      player.playVideo();
    }
  }

  const subtitle = [
    video.channel,
    video.createdAt && new Date(video.createdAt).toLocaleDateString(),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="text-gray-900">
      {/* Top video card */}
      <div className="mb-4 flex items-center gap-3 rounded-md border border-gray-300 p-3">
        {video.thumbnailUrl && (
          <Image
            src={video.thumbnailUrl}
            alt=""
            width={96}
            height={56}
            className="h-14 w-24 rounded object-cover"
          />
        )}
        <div>
          <p className="font-semibold">{video.title}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* iframe */}
        <div className="aspect-video w-full overflow-hidden rounded-md border border-gray-300">
          <iframe
            id={`yt-player-${video.youtubeId}`}
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&enablejsapi=1`}
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
                  <button
                    onClick={() => handleSeek(t.time)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-indigo-50"
                  >
                    <span className="font-mono text-xs text-indigo-600">
                      {formatTime(t.time)}
                    </span>
                    <span>{t.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {tab === "transcript" &&
            (video.transcript ? (
              <div>
                <div
                  className={`flex flex-col gap-2 overflow-y-auto pr-1 ${
                    transcriptExpanded ? "" : "max-h-64"
                  }`}
                >
                  {parseTranscript(video.transcript).map((line, i) => (
                    <p key={i} className="text-sm">
                      <span className="mr-2 font-mono text-xs text-gray-400">
                        {formatTime(line.time)}
                      </span>
                      {line.text}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => setTranscriptExpanded((prev) => !prev)}
                  className="mt-2 text-xs font-medium text-indigo-600 hover:underline"
                >
                  {transcriptExpanded ? "Show less" : "Show full transcript"}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No transcript available.
              </p>
            ))}
        </div>
      </div>
    </div>
  );
}
