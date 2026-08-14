"use client";
import logout from "@/helpers/logout";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  return (
    <>
      <div>dashboard</div>
      <button
        className="border rounded"
        onClick={() => {
          logout();
          router.push("/");
        }}
      >
        logout
      </button>
    </>
  );
}
