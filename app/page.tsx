import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <div className="flex justify-between p-5">
          <h1>Timestamp</h1>
          <div className="flex gap-3">
            <Link href="/login" className="border rounded">
              Login
            </Link>
            <Link href="/register" className="border rounded">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
