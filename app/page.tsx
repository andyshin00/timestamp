import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div>
        <div className="flex justify-between p-5">
          <h1 className="font-bold">Timestamp</h1>
          <div className="flex gap-3">
            <Button>
              <Link href="/login">Login</Link>
            </Button>
            <Button>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
