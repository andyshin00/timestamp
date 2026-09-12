"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchVideo } from "@/helpers/videos";
import { Video } from "@/types";
import Navbar from "@/components/layout/Navbar";
import VideoResult from "@/components/videos/VideoResult";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function VideoPage() {
  const params = useParams<{ id: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadVideo() {
      try {
        const data = await fetchVideo(Number(params.id));
        setVideo(data);
      } catch (err) {
        setError((err as Error).message);
      }
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

      <div className="mx-auto max-w-5xl p-6">
        <VideoResult video={video} />
      </div>
    </div>
  );
}
