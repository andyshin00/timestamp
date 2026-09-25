import { useEffect, useState } from "react";
import { getToken, clearToken } from "@/lib/auth";
import LoginForm from "./LoginForm";
import extractVideoId from "@/lib/extractVideoId";

type Auth = "checking" | "out" | "in";

type TabState =
  | { status: "loading" }
  | { status: "not-youtube" }
  | { status: "ready"; videoId: string };

export default function App() {
  const [auth, setAuth] = useState<Auth>("checking");

  useEffect(() => {
    getToken().then((t) => setAuth(t ? "in" : "out"));
  }, []);

  return (
    <div className="w-90 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-lg font-bold">TimestampGen</h1>
        {auth === "in" && (
          <button
            className="text-xs text-gray-500 underline"
            onClick={() => clearToken().then(() => setAuth("out"))}
          >
            Sign out
          </button>
        )}
      </div>

      {auth === "checking" && <p className="text-sm text-gray-500">…</p>}
      {auth === "out" && <LoginForm onSuccess={() => setAuth("in")} />}
      {auth === "in" && <Main />}
    </div>
  );
}

function Main() {
  const [state, setState] = useState<TabState>({ status: "loading" });

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      const videoId = tab?.url ? extractVideoId(tab.url) : null;
      setState(
        videoId ? { status: "ready", videoId } : { status: "not-youtube" },
      );
    });
  }, []);

  if (state.status === "loading")
    return <p className="text-sm text-gray-500">Checking this tab…</p>;
  if (state.status === "not-youtube")
    return (
      <p className="text-sm text-gray-500">
        Open a YouTube video, then reopen this popup.
      </p>
    );
  return (
    <div className="text-sm">
      <p className="text-gray-500">Detected video</p>
      <p className="font-mono">{state.videoId}</p>
    </div>
  );
}
