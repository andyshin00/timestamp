import Link from "next/link";
import { Link2, Sparkles, MousePointerClick, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    icon: Link2,
    title: "Paste a link",
    description:
      "Drop any YouTube URL into your dashboard or the browser extension.",
  },
  {
    icon: Sparkles,
    title: "AI reads it",
    description: "We pull the transcript and find the key sections in seconds.",
  },
  {
    icon: MousePointerClick,
    title: "Jump right in",
    description: "Click a timestamp and the video jumps straight there.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-600">
            <Play className="size-4 fill-white text-white" />
          </div>
          <span className="text-lg font-bold">Timestamp</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <Link href="/login">Log in</Link>
          </Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Link href="/register">Get started free</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-3xl px-6 py-16 text-center sm:px-10 lg:py-20">
          <p className="mb-3 text-sm font-semibold text-indigo-600">
            AI-generated YouTube timestamps
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Every video, outlined for you.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Paste a link below and Timestamp reads the transcript, finds the
            key moments, and hands you a list you can click straight into the
            video.
          </p>
        </section>

        {/* How it works */}
        <section className="border-t border-border bg-muted/30 px-6 py-16 sm:px-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold">How it works</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex size-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <step.icon className="size-5" />
                  </div>
                  <p className="mt-4 text-xs font-semibold text-muted-foreground">
                    STEP {i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold">{step.title}</h3>
                  <p className="mt-1 max-w-64 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground sm:px-10">
        © {new Date().getFullYear()} Timestamp
      </footer>
    </div>
  );
}
