"use client";
import { useState } from "react";
import PasteLinkForm from "@/components/videos/PasteLinkForm";
import VideoResult from "@/components/videos/VideoResult";
import { generatePreview } from "@/helpers/videos";
import type { VideoResultData } from "@/types";

// The root page's free, no-account version of "paste a link, get
// timestamps." Same components the dashboard uses, wired to the
// unauthenticated /api/videos/preview endpoint instead — nothing here
// is ever saved.
export default function TryItPanel() {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<VideoResultData | null>(null);

  async function handleSubmit(url: string) {
    setError("");
    setIsSubmitting(true);

    try {
      const data = await generatePreview(url);
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <PasteLinkForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        title="Try it free — no account needed"
        description="Paste a YouTube link and see the timestamps it generates."
      />

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <VideoResult video={result} />
        </div>
      )}
    </div>
  );
}
