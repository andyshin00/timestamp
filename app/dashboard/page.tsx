"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Inbox } from "lucide-react";
import { Video } from "@/types";
import Navbar from "@/components/layout/Navbar";
import PasteLinkForm from "@/components/videos/PasteLinkForm";
import { fetchVideos, createVideo, deleteVideo } from "@/helpers/videos";
import Image from "next/image";

export default function Dashboard() {
  const [error, setError] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadVideos() {
    try {
      const data = await fetchVideos();
      setVideos(data);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    // loadVideos is also called from handleSubmit to refresh the library
    // after creating a video, so it can't be defined only inside this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadVideos();
  }, []);

  async function handleSubmit(url: string) {
    setError("");
    setIsSubmitting(true);

    try {
      await createVideo(url);
      await loadVideos();
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteVideo(id);
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Dashboard*/}
      <main className="mx-auto max-w-5xl p-6">
        {/* Paste a Link Card */}
        <PasteLinkForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />

        {/* User Library */}
        <h2 className="mt-10 mb-4 text-xl font-bold">Your Library</h2>
        {videos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-gray-100">
              <Inbox className="size-6 text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">No videos yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Paste a YouTube link above to get your first timestamps.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <Link
                  href={`/video/${video.id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  {video.thumbnailUrl && (
                    <Image
                      src={video.thumbnailUrl}
                      alt=""
                      width={128}
                      height={80}
                      className="h-20 w-32 rounded-lg object-cover"
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
                </Link>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="rounded-md border border-gray-200 p-2 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
