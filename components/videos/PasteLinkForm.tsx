"use client";
import { useState } from "react";
import { Link2 } from "lucide-react";
import { TailSpin } from "react-loader-spinner";

export default function PasteLinkForm({
  onSubmit,
  isSubmitting,
  error,
  title = "Paste a YouTube Link",
  description = "This will extract timestamps and transcript for you.",
}: {
  onSubmit: (youtubeUrl: string) => Promise<void>;
  isSubmitting: boolean;
  error: string;
  title?: string;
  description?: string;
}) {
  const [url, setUrl] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await onSubmit(url);
      setUrl("");
    } catch {
      // Parent surfaces the error via the `error` prop — keep the URL
      // in the input so the user can fix it and retry.
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
          <Link2 className="size-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex gap-3">
        <input
          onChange={(e) => setUrl(e.currentTarget.value)}
          value={url}
          type="text"
          placeholder="https://www.youtube.com/watch?v=..."
          className="min-w-0 flex-1 rounded-md border border-gray-300 py-1 px-3"
        />
        <button
          className="shrink-0 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <TailSpin height="20" width="20" />
          ) : (
            "Get Timestamps"
          )}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
