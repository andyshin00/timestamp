"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import logout from "@/helpers/logout";
import { getMe } from "@/helpers/auth";

export default function Navbar() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMe()
      .then((user) => setEmail(user.email))
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const initial = email ? email[0].toUpperCase() : "";

  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
          <Play className="size-5 fill-white text-white" />
        </div>
        <span className="text-lg font-bold">Timestamp</span>
      </div>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex size-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground"
        >
          {initial}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-md border border-gray-200 bg-white p-3 shadow-lg">
            <p className="break-all text-sm font-medium text-gray-900">
              {email}
            </p>
            <hr className="my-2 border-gray-200" />
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-500 hover:underline"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
