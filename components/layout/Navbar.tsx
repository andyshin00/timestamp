import { useRouter } from "next/navigation";
import { Play, User, ChevronDown } from "lucide-react";
import logout from "@/helpers/logout";

export default function Navbar() {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-600">
          <Play className="size-5 fill-white text-white" />
        </div>
        <span className="text-lg font-bold">Timestamp</span>
      </div>
      {/* Account Menu */}
      <div className="flex flex-row gap-5">
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="text-red-400 rounded-full border border-gray-200 py-1 px-3 hover:bg-gray-50"
        >
          Logout
        </button>
        <button className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 hover:bg-gray-50">
          <span className="flex size-7 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <User className="size-4" />
          </span>
          <span className="text-sm font-medium">Account</span>
          <ChevronDown className="size-4 text-gray-400" />
        </button>
      </div>
    </header>
  );
}
