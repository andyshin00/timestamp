"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import formatTime from "@/helpers/formatTime";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const DEMO_VIDEO = {
  title: "Building a Neural Network From Scratch",
  channel: "CodeWithAda",
  duration: "24:18",
};

const DEMO_TIMESTAMPS = [
  { time: 0, label: "Introduction" },
  { time: 134, label: "Setting up the environment" },
  { time: 527, label: "Building the model" },
  { time: 932, label: "Training loop" },
  { time: 1265, label: "Results & next steps" },
];

export default function DemoPanel() {
  const [activeTime, setActiveTime] = useState<number | null>(null);

  return (
    <Card className="w-full max-w-md ring-1 ring-foreground/10 shadow-lg">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-3">
          <div className="flex aspect-video w-20 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-indigo-700">
            <Play className="size-5 fill-white text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">
              {DEMO_VIDEO.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {DEMO_VIDEO.channel} · {DEMO_VIDEO.duration}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-3">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Generated timestamps
        </p>
        <ul className="flex flex-col">
          {DEMO_TIMESTAMPS.map((ts) => (
            <li key={ts.time}>
              <button
                type="button"
                onClick={() => setActiveTime(ts.time)}
                className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                  activeTime === ts.time
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-muted"
                }`}
              >
                <span className="w-10 shrink-0 font-mono text-xs text-muted-foreground">
                  {formatTime(ts.time)}
                </span>
                <span className="flex-1">{ts.label}</span>
                {activeTime === ts.time && (
                  <Play className="size-3 shrink-0 fill-indigo-600 text-indigo-600" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
